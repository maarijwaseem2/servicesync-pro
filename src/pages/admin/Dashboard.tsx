import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
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

const AdminDashboard = () => {
  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await api.get('/services');
      return res.data;
    }
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const res = await api.get('/bookings');
      return res.data;
    }
  });

  const stats = [
    {
      icon: Users,
      label: "Total customers",
      value: "8,245",
      delta: "+12%",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Briefcase,
      label: "Total providers",
      value: "342",
      delta: "+5%",
      color: "bg-accent/15 text-accent",
    },
    {
      icon: ClipboardList,
      label: "Total bookings",
      value: bookings.length.toString(),
      delta: "+18%",
      color: "bg-success/15 text-success",
    },
    {
      icon: DollarSign,
      label: "Services",
      value: services.length.toString(),
      color: "bg-warning/15 text-warning",
    },
    {
      icon: CheckCircle2,
      label: "Completed",
      value: bookings.filter((b: any) => b.status === 'COMPLETED').length.toString(),
      color: "bg-success/15 text-success",
    },
    {
      icon: Clock,
      label: "Pending",
      value: bookings.filter((b: any) => b.status === 'PENDING').length.toString(),
      color: "bg-warning/15 text-warning",
    },
  ];

  const monthly = [
    { m: "Jan", bookings: 820 },
    { m: "Feb", bookings: 940 },
    { m: "Mar", bookings: 1120 },
    { m: "Apr", bookings: 1280 },
    { m: "May", bookings: 1410 },
    { m: "Jun", bookings: 1340 },
  ];
  const status = [
    { name: "Completed", value: 68, color: "hsl(152 55% 42%)" },
    { name: "Accepted", value: 14, color: "hsl(184 65% 32%)" },
    { name: "Pending", value: 10, color: "hsl(38 92% 55%)" },
    { name: "Cancelled", value: 8, color: "hsl(0 75% 55%)" },
  ];

  return (
  <DashboardShell
    variant="admin"
    title="Dashboard"
    subtitle="Overview of platform activity and performance."
  >
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border bg-card p-5 shadow-soft"
        >
          <div
            className={`grid h-10 w-10 place-items-center rounded-xl ${s.color}`}
          >
            <s.icon className="h-5 w-5" />
          </div>
          <div className="mt-3 font-display text-2xl font-bold">{s.value}</div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{s.label}</span>
            {s.delta && (
              <span className="font-medium text-success">{s.delta}</span>
            )}
          </div>
        </div>
      ))}
    </div>

    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      <div className="rounded-2xl border bg-card p-6 shadow-soft lg:col-span-2">
        <div className="mb-4 font-display text-lg font-semibold">
          Bookings over time
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthly}>
            <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 12,
              }}
            />
            <Bar
              dataKey="bookings"
              fill="hsl(var(--primary))"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-2xl border bg-card p-6 shadow-soft">
        <div className="mb-4 font-display text-lg font-semibold">
          Booking status
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={status}
              dataKey="value"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
            >
              {status.map((s, i) => (
                <Cell key={i} fill={s.color} />
              ))}
            </Pie>
            <Legend iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      <div className="rounded-2xl border bg-card p-6 shadow-soft lg:col-span-2">
        <div className="mb-4 font-display text-lg font-semibold">
          Recent bookings
        </div>
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
              {bookings.slice(0, 5).map((b: any) => (
                <tr key={b.id} className="border-t">
                  <td className="py-3 font-mono text-xs">{b.id}</td>
                  <td>{b.service?.title}</td>
                  <td>{b.provider?.name || "Assigned shortly"}</td>
                  <td>
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="text-right font-semibold">${b.service?.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="rounded-2xl border bg-card p-6 shadow-soft">
        <div className="mb-4 font-display text-lg font-semibold">
          Top services
        </div>
        <div className="space-y-3">
          {services.slice(0, 5).map((s: any, i: number) => (
            <div key={s.id} className="flex items-center gap-3">
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border">
                <img
                  src={s.imageUrl || '/assets/deep-cleaning.jfif'}
                  alt={s.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{s.title}</div>
                <div className="h-1.5 w-full rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full gradient-hero"
                    style={{ width: `${100 - i * 15}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {500 - i * 60}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </DashboardShell>
  );
};

export default AdminDashboard;
