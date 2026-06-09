import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, assetUrl } from "@/lib/api";
import {
  Users,
  Briefcase,
  ClipboardList,
  CheckCircle2,
  Clock,
  DollarSign,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { DashboardShell } from "@/components/DashboardShell";
import { StatusBadge } from "@/components/StatusBadge";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const AdminDashboard = () => {
  const { data: services = [] } = useQuery({
    queryKey: ["admin-services"],
    queryFn: () => api.get("/services/admin/all").then((r) => r.data),
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => api.get("/bookings").then((r) => r.data),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/users").then((r) => r.data),
  });

  const customerCount = (users as any[]).filter((u: any) => u.role === "CUSTOMER").length;
  const providerCount = (users as any[]).filter((u: any) => u.role === "PROVIDER").length;

  const completedCount = (bookings as any[]).filter((b: any) => b.status === "COMPLETED").length;
  const pendingCount   = (bookings as any[]).filter((b: any) => b.status === "PENDING").length;

  // Group bookings by month for chart (last 6 months)
  const monthly = useMemo(() => {
    const now = new Date();
    const counts: Record<number, number> = {};
    for (let i = 5; i >= 0; i--) {
      const m = (now.getMonth() - i + 12) % 12;
      counts[m] = 0;
    }
    (bookings as any[]).forEach((b: any) => {
      const m = new Date(b.createdAt).getMonth();
      if (m in counts) counts[m] = (counts[m] || 0) + 1;
    });
    return Object.entries(counts).map(([m, count]) => ({
      m: MONTH_LABELS[Number(m)],
      bookings: count,
    }));
  }, [bookings]);

  // Real booking status breakdown
  const statusData = useMemo(() => {
    const groups: Record<string, number> = { COMPLETED: 0, PENDING: 0, CONFIRMED: 0, CANCELLED: 0 };
    (bookings as any[]).forEach((b: any) => {
      if (b.status in groups) groups[b.status]++;
    });
    return [
      { name: "Completed",  value: groups.COMPLETED,  color: "hsl(152 55% 42%)" },
      { name: "Confirmed",  value: groups.CONFIRMED,  color: "hsl(184 65% 32%)" },
      { name: "Pending",    value: groups.PENDING,    color: "hsl(38 92% 55%)"  },
      { name: "Cancelled",  value: groups.CANCELLED,  color: "hsl(0 75% 55%)"   },
    ].filter((s) => s.value > 0);
  }, [bookings]);

  const stats = [
    {
      icon: Users,
      label: "Total customers",
      value: customerCount.toString(),
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Briefcase,
      label: "Total providers",
      value: providerCount.toString(),
      color: "bg-accent/15 text-accent",
    },
    {
      icon: ClipboardList,
      label: "Total bookings",
      value: (bookings as any[]).length.toString(),
      color: "bg-success/15 text-success",
    },
    {
      icon: DollarSign,
      label: "Services",
      value: (services as any[]).length.toString(),
      color: "bg-warning/15 text-warning",
    },
    {
      icon: CheckCircle2,
      label: "Completed",
      value: completedCount.toString(),
      color: "bg-success/15 text-success",
    },
    {
      icon: Clock,
      label: "Pending",
      value: pendingCount.toString(),
      color: "bg-warning/15 text-warning",
    },
  ];

  return (
    <DashboardShell
      variant="admin"
      title="Dashboard"
      subtitle="Overview of platform activity and performance."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border bg-card p-5 shadow-soft">
            <div className={`grid h-10 w-10 place-items-center rounded-xl ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="mt-3 font-display text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="mb-4 font-display text-lg font-semibold">Bookings over time</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthly}>
              <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" />
              <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 12,
                }}
              />
              <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <div className="mb-4 font-display text-lg font-semibold">Booking status</div>
          {statusData.length === 0 ? (
            <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
              No bookings yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={statusData} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {statusData.map((s, i) => (
                    <Cell key={i} fill={s.color} />
                  ))}
                </Pie>
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="mb-4 font-display text-lg font-semibold">Recent bookings</div>
          {(bookings as any[]).length === 0 ? (
            <p className="text-sm text-muted-foreground">No bookings yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="py-2">ID</th>
                    <th>Service</th>
                    <th>Provider</th>
                    <th>Status</th>
                    <th className="text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {(bookings as any[]).slice(0, 5).map((b: any) => (
                    <tr key={b.id} className="border-t">
                      <td className="py-3 font-mono text-xs">{b.id.slice(0, 8)}…</td>
                      <td>{b.service?.title}</td>
                      <td>{b.provider?.name || "Unassigned"}</td>
                      <td><StatusBadge status={b.status} /></td>
                      <td className="text-right font-semibold">${b.service?.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <div className="mb-4 font-display text-lg font-semibold">Top services</div>
          {(services as any[]).length === 0 ? (
            <p className="text-sm text-muted-foreground">No services yet.</p>
          ) : (
            <div className="space-y-3">
              {(services as any[]).slice(0, 5).map((s: any, i: number) => {
                const barWidths = ["w-full", "w-[85%]", "w-[70%]", "w-[55%]", "w-[40%]"];
                return (
                  <div key={s.id} className="flex items-center gap-3">
                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border">
                      <img
                        src={s.imageUrl ? assetUrl(s.imageUrl) : "/assets/deep-cleaning.jfif"}
                        alt={s.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{s.title}</div>
                      <div className="h-1.5 w-full rounded-full bg-secondary">
                        <div className={`h-full rounded-full gradient-hero ${barWidths[i] ?? "w-[25%]"}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
};

export default AdminDashboard;
