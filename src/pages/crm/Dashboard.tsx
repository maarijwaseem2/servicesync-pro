import { DashboardShell } from "@/components/DashboardShell";
import { leads } from "@/data/mock";
import { TrendingUp, Users, Target, DollarSign, Phone, ArrowUpRight } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";

const stageColors: Record<string, string> = {
  New: "bg-sky-500/15 text-sky-600",
  Contacted: "bg-violet-500/15 text-violet-600",
  Qualified: "bg-primary/10 text-primary",
  Proposal: "bg-warning/15 text-warning",
  Won: "bg-success/15 text-success",
  Lost: "bg-destructive/10 text-destructive",
};

const trend = [
  { d: "Mon", v: 12 }, { d: "Tue", v: 18 }, { d: "Wed", v: 15 }, { d: "Thu", v: 22 },
  { d: "Fri", v: 28 }, { d: "Sat", v: 14 }, { d: "Sun", v: 9 },
];
const sources = [
  { s: "Website", v: 124 }, { s: "Referral", v: 86 }, { s: "Ads", v: 72 },
  { s: "Social", v: 45 }, { s: "Cold call", v: 28 }, { s: "Event", v: 18 },
];

const CRMDashboard = () => (
  <DashboardShell variant="crm" title="Pipeline overview" subtitle="Your team's sales activity at a glance.">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        { icon: Users, label: "Total leads", value: "1,284", delta: "+12%", color: "bg-primary/10 text-primary" },
        { icon: Target, label: "Qualified", value: "412", delta: "+8%", color: "bg-accent/15 text-accent" },
        { icon: DollarSign, label: "Pipeline value", value: "$284,400", delta: "+22%", color: "bg-warning/15 text-warning" },
        { icon: TrendingUp, label: "Win rate", value: "38%", delta: "+4%", color: "bg-success/15 text-success" },
      ].map(s => (
        <div key={s.label} className="rounded-2xl border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div className={`grid h-10 w-10 place-items-center rounded-xl ${s.color}`}><s.icon className="h-5 w-5" /></div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-success">{s.delta} <ArrowUpRight className="h-3 w-3" /></span>
          </div>
          <div className="mt-3 font-display text-3xl font-bold">{s.value}</div>
          <div className="text-sm text-muted-foreground">{s.label}</div>
        </div>
      ))}
    </div>

    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      <div className="rounded-2xl border bg-card p-6 shadow-soft lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <div className="font-display text-lg font-semibold">Leads this week</div>
          <span className="text-xs text-muted-foreground">118 new leads</span>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={trend}>
            <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} /><stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient></defs>
            <XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" /><YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
            <Area type="monotone" dataKey="v" stroke="hsl(var(--primary))" fill="url(#g1)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-2xl border bg-card p-6 shadow-soft">
        <div className="mb-4 font-display text-lg font-semibold">Lead sources</div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={sources} layout="vertical">
            <XAxis type="number" hide /><YAxis dataKey="s" type="category" stroke="hsl(var(--muted-foreground))" width={70} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
            <Bar dataKey="v" fill="hsl(var(--primary))" radius={[0,8,8,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      <div className="rounded-2xl border bg-card p-6 shadow-soft lg:col-span-2">
        <div className="mb-4 font-display text-lg font-semibold">Recent leads</div>
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-muted-foreground"><tr><th className="py-2">Lead</th><th>Source</th><th>Stage</th><th>Owner</th><th className="text-right">Value</th></tr></thead>
          <tbody>
            {leads.map(l => (
              <tr key={l.id} className="border-t">
                <td className="py-3"><div className="font-medium">{l.name}</div><div className="text-xs text-muted-foreground">{l.contact}</div></td>
                <td>{l.source}</td>
                <td><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${stageColors[l.stage]}`}>{l.stage}</span></td>
                <td>{l.owner}</td>
                <td className="text-right font-semibold">${l.value.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-2xl border bg-card p-6 shadow-soft">
        <div className="mb-4 font-display text-lg font-semibold">Today's follow-ups</div>
        <div className="space-y-3">
          {leads.filter(l => l.nextFollowUp !== "—").slice(0,4).map(l => (
            <div key={l.id} className="flex items-center gap-3 rounded-xl border p-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary"><Phone className="h-4 w-4" /></div>
              <div className="flex-1">
                <div className="text-sm font-medium">{l.name}</div>
                <div className="text-xs text-muted-foreground">{l.nextFollowUp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </DashboardShell>
);

export default CRMDashboard;
