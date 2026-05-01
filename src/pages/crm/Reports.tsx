import { DashboardShell } from "@/components/DashboardShell";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";

const monthly = [
  { m: "Jan", won: 18, lost: 8 }, { m: "Feb", won: 22, lost: 10 }, { m: "Mar", won: 28, lost: 9 },
  { m: "Apr", won: 31, lost: 12 }, { m: "May", won: 36, lost: 11 }, { m: "Jun", won: 42, lost: 14 },
];
const team = [{ a: "You", v: 124 }, { a: "Sam", v: 98 }, { a: "Mia", v: 76 }, { a: "Leo", v: 54 }];
const dist = [
  { name: "Won", value: 38, color: "hsl(152 55% 42%)" },
  { name: "Lost", value: 14, color: "hsl(0 75% 55%)" },
  { name: "Open", value: 48, color: "hsl(184 65% 32%)" },
];

const Reports = () => (
  <DashboardShell variant="crm" title="Reports" subtitle="Performance insights for your team.">
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Won vs Lost (monthly)">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={monthly}>
            <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" /><YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
            <Line type="monotone" dataKey="won" stroke="hsl(var(--success))" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="lost" stroke="hsl(var(--destructive))" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card title="Team performance">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={team}>
            <XAxis dataKey="a" stroke="hsl(var(--muted-foreground))" /><YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
            <Bar dataKey="v" fill="hsl(var(--primary))" radius={[8,8,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card title="Outcome distribution">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={dist} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={3}>
              {dist.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
            <Legend iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </Card>
      <Card title="Conversion funnel">
        <div className="space-y-3 py-4">
          {[
            ["Leads", 1284, 100],
            ["Contacted", 842, 65],
            ["Qualified", 412, 32],
            ["Proposal", 198, 15],
            ["Won", 124, 9],
          ].map(([l, n, p]) => (
            <div key={l as string}>
              <div className="mb-1 flex justify-between text-sm"><span className="font-medium">{l}</span><span className="text-muted-foreground">{n} ({p}%)</span></div>
              <div className="h-2.5 w-full rounded-full bg-secondary"><div className="h-full rounded-full gradient-hero" style={{ width: `${p}%` }} /></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </DashboardShell>
);

const Card = ({ title, children }: any) => (
  <div className="rounded-2xl border bg-card p-6 shadow-soft">
    <div className="mb-2 font-display text-lg font-semibold">{title}</div>
    {children}
  </div>
);

export default Reports;
