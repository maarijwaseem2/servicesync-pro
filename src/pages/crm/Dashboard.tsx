import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TrendingUp, Users, Target, DollarSign } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { DashboardShell } from "@/components/DashboardShell";
import { CRM_SOURCES, STAGE_COLORS, statusToStage, bookingSource } from "@/lib/crm";

const CRMDashboard = () => {
  const { data: bookings = [] } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => api.get("/bookings").then((res) => res.data),
  });

  const leads = bookings.map((b: any) => ({
    id: b.id,
    name: b.customer?.name || "Unknown",
    email: b.customer?.email || "",
    source: bookingSource(b.id),
    stage: statusToStage(b.status),
    owner: b.provider?.name || "Unassigned",
    value: Number(b.service?.price) || 0,
    service: b.service?.title || "",
    date: b.date,
  }));

  const won = leads.filter((l: any) => l.stage === "Won");
  const winRate = leads.length ? Math.round((won.length / leads.length) * 100) : 0;
  const pipelineValue = leads.reduce((s: number, l: any) => s + l.value, 0);
  const qualified = leads.filter(
    (l: any) => l.stage === "Qualified" || l.stage === "Won",
  ).length;

  const stats = [
    { icon: Users, label: "Total leads", value: leads.length.toString(), delta: `${leads.length} bookings` },
    { icon: Target, label: "Qualified", value: qualified.toString(), delta: `${won.length} won` },
    { icon: DollarSign, label: "Pipeline value", value: `$${(pipelineValue / 1000).toFixed(1)}k`, delta: `${leads.length} deals` },
    { icon: TrendingUp, label: "Win rate", value: `${winRate}%`, delta: `${won.length} completed` },
  ];

  // Bookings per weekday this week
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const trend = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    const v = bookings.filter((b: any) => {
      if (!b.date) return false;
      return new Date(b.date).toDateString() === day.toDateString();
    }).length;
    return { d, v };
  });

  // Lead source counts
  const sourceCounts: Record<string, number> = {};
  CRM_SOURCES.forEach((s) => { sourceCounts[s] = 0; });
  leads.forEach((l: any) => { sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1; });
  const sources = Object.entries(sourceCounts).map(([s, v]) => ({ s, v }));

  return (
    <DashboardShell
      variant="crm"
      title="CRM Dashboard"
      subtitle="Track leads, pipeline, and sales performance."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border bg-card p-5 shadow-soft">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <s.icon className="h-5 w-5" />
            </div>
            <div className="mt-3 font-display text-2xl font-bold">{s.value}</div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{s.label}</span>
              <span className="font-medium text-success">{s.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <div className="mb-4 font-display text-lg font-semibold">
            Bookings this week
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="v"
                stroke="hsl(var(--primary))"
                fill="url(#g1)"
                strokeWidth={2.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <div className="mb-4 font-display text-lg font-semibold">Lead sources</div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sources} layout="vertical">
              <XAxis type="number" hide allowDecimals={false} />
              <YAxis
                dataKey="s"
                type="category"
                stroke="hsl(var(--muted-foreground))"
                width={70}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 12,
                }}
              />
              <Bar dataKey="v" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-card p-6 shadow-soft">
        <div className="mb-4 font-display text-lg font-semibold">Recent leads</div>
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="py-2">Lead</th>
              <th>Service</th>
              <th>Source</th>
              <th>Stage</th>
              <th>Owner</th>
              <th className="text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {leads.slice(0, 6).map((l: any) => (
              <tr key={l.id} className="border-t">
                <td className="py-3">
                  <div className="font-medium">{l.name}</div>
                  <div className="text-xs text-muted-foreground">{l.email}</div>
                </td>
                <td className="text-muted-foreground">{l.service}</td>
                <td>{l.source}</td>
                <td>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${STAGE_COLORS[l.stage]}`}
                  >
                    {l.stage}
                  </span>
                </td>
                <td>{l.owner}</td>
                <td className="text-right font-semibold">
                  ${l.value.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
};

export default CRMDashboard;
