import { DashboardShell } from "@/components/DashboardShell";
import { StatusBadge } from "@/components/StatusBadge";
import { bookings } from "@/data/mock";
import { ClipboardList, CheckCircle2, Clock, XCircle, DollarSign, TrendingUp } from "lucide-react";

const Stat = ({ icon: Icon, label, value, delta, color }: any) => (
  <div className="rounded-2xl border bg-card p-5 shadow-soft">
    <div className="flex items-center justify-between">
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${color}`}><Icon className="h-5 w-5" /></div>
      {delta && <span className="text-xs font-medium text-success">+{delta}</span>}
    </div>
    <div className="mt-3 font-display text-3xl font-bold">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

const ProviderDashboard = () => (
  <DashboardShell variant="provider" title="Welcome back, Ahmed 👋" subtitle="Here's what's happening with your jobs today.">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Stat icon={ClipboardList} label="Total assigned" value="42" color="bg-primary/10 text-primary" delta="12%" />
      <Stat icon={Clock} label="Pending" value="3" color="bg-warning/15 text-warning" />
      <Stat icon={CheckCircle2} label="Completed" value="36" color="bg-success/15 text-success" delta="8%" />
      <Stat icon={XCircle} label="Cancelled" value="3" color="bg-destructive/10 text-destructive" />
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      <div className="rounded-2xl border bg-card p-6 shadow-soft lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <div className="font-display text-lg font-semibold">Today's jobs</div>
          <span className="text-xs text-muted-foreground">3 scheduled</span>
        </div>
        <div className="space-y-3">
          {bookings.slice(0, 3).map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <div className="font-semibold">{b.service}</div>
                <div className="text-xs text-muted-foreground">{b.time} · {b.address}</div>
              </div>
              <StatusBadge status={b.status} />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl gradient-hero p-6 text-primary-foreground shadow-glow">
        <div className="flex items-center gap-2 text-sm opacity-90"><DollarSign className="h-4 w-4" /> Earnings this month</div>
        <div className="mt-2 font-display text-4xl font-bold">$2,486</div>
        <div className="mt-1 flex items-center gap-1 text-sm opacity-90"><TrendingUp className="h-4 w-4" /> +18% vs last month</div>
        <div className="mt-6 grid grid-cols-7 items-end gap-1.5 h-24">
          {[40,55,30,70,50,80,65].map((h,i) => (
            <div key={i} className="rounded-t bg-primary-foreground/30" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
    <div className="mt-6 rounded-2xl border bg-card p-6 shadow-soft">
      <div className="mb-4 font-display text-lg font-semibold">Recent bookings</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-muted-foreground">
            <tr><th className="py-2">ID</th><th>Service</th><th>Date</th><th>Status</th><th className="text-right">Price</th></tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} className="border-t">
                <td className="py-3 font-mono text-xs">{b.id}</td>
                <td>{b.service}</td>
                <td>{b.date}</td>
                <td><StatusBadge status={b.status} /></td>
                <td className="text-right font-semibold">${b.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </DashboardShell>
);

export default ProviderDashboard;
