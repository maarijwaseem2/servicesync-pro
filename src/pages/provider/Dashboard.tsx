import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  TrendingUp,
} from "lucide-react";

import { DashboardShell } from "@/components/DashboardShell";
import { StatusBadge } from "@/components/StatusBadge";

const Stat = ({ icon: Icon, label, value, delta, color }: any) => (
  <div className="rounded-2xl border bg-card p-5 shadow-soft">
    <div className="flex items-center justify-between">
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      {delta && (
        <span className="text-xs font-medium text-success">+{delta}</span>
      )}
    </div>
    <div className="mt-3 font-display text-3xl font-bold">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

const ProviderDashboard = () => {
  const { user } = useAuth();

  const { data: bookings = [] } = useQuery({
    queryKey: ["provider-bookings"],
    queryFn: () => api.get("/bookings").then((res) => res.data),
  });

  const todayStr = new Date().toISOString().slice(0, 10);

  const todaysJobs = useMemo(
    () => (bookings as any[]).filter((b: any) => b.date === todayStr),
    [bookings, todayStr],
  );

  const pendingCount   = (bookings as any[]).filter((b: any) => b.status === "PENDING").length;
  const completedCount = (bookings as any[]).filter((b: any) => b.status === "COMPLETED").length;
  const cancelledCount = (bookings as any[]).filter((b: any) => b.status === "CANCELLED").length;

  // Earnings: sum totalAmount (or service.price fallback) of COMPLETED bookings this month
  const earnings = useMemo(() => {
    const now = new Date();
    return (bookings as any[])
      .filter((b: any) => {
        if (b.status !== "COMPLETED") return false;
        const d = new Date(b.createdAt || b.date);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      })
      .reduce((sum: number, b: any) => {
        const amount = Number(b.totalAmount) || Number(b.service?.price) || 0;
        return sum + amount;
      }, 0);
  }, [bookings]);

  // Last 7 days bar chart heights (relative to max)
  const weeklyEarnings = useMemo(() => {
    const days: number[] = Array(7).fill(0);
    const now = new Date();
    (bookings as any[])
      .filter((b: any) => b.status === "COMPLETED")
      .forEach((b: any) => {
        const d = new Date(b.createdAt || b.date);
        const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
        if (diffDays >= 0 && diffDays < 7) {
          days[6 - diffDays] += Number(b.totalAmount) || Number(b.service?.price) || 0;
        }
      });
    const max = Math.max(...days, 1);
    return days.map((v) => Math.round((v / max) * 100));
  }, [bookings]);

  return (
    <DashboardShell
      variant="provider"
      title={`Welcome back, ${user?.name || "Provider"} 👋`}
      subtitle="Here's what's happening with your jobs today."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={ClipboardList}
          label="Total assigned"
          value={(bookings as any[]).length.toString()}
          color="bg-primary/10 text-primary"
        />
        <Stat
          icon={Clock}
          label="Pending"
          value={pendingCount.toString()}
          color="bg-warning/15 text-warning"
        />
        <Stat
          icon={CheckCircle2}
          label="Completed"
          value={completedCount.toString()}
          color="bg-success/15 text-success"
        />
        <Stat
          icon={XCircle}
          label="Cancelled"
          value={cancelledCount.toString()}
          color="bg-destructive/10 text-destructive"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-display text-lg font-semibold">Today's jobs</div>
            <span className="text-xs text-muted-foreground">
              {todaysJobs.length} scheduled
            </span>
          </div>
          {todaysJobs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No jobs scheduled for today.</p>
          ) : (
            <div className="space-y-3">
              {todaysJobs.map((b: any) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between rounded-xl border p-4"
                >
                  <div>
                    <div className="font-semibold">{b.service?.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {b.time || "—"} · {b.address || b.specialInstructions || "No address"}
                    </div>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl gradient-hero p-6 text-primary-foreground shadow-glow">
          <div className="flex items-center gap-2 text-sm opacity-90">
            <DollarSign className="h-4 w-4" /> Earnings this month
          </div>
          <div className="mt-2 font-display text-4xl font-bold">
            ${earnings.toFixed(2)}
          </div>
          {earnings > 0 ? (
            <div className="mt-1 flex items-center gap-1 text-sm opacity-90">
              <TrendingUp className="h-4 w-4" /> From {completedCount} completed job{completedCount !== 1 ? "s" : ""}
            </div>
          ) : (
            <div className="mt-1 text-sm opacity-70">No completed jobs yet this month</div>
          )}
          <div className="mt-6 grid grid-cols-7 items-end gap-1.5 h-24">
            {weeklyEarnings.map((h, i) => {
              const heightClass =
                h >= 85 ? "h-[85%]" :
                h >= 70 ? "h-[70%]" :
                h >= 55 ? "h-[55%]" :
                h >= 40 ? "h-[40%]" :
                h >= 25 ? "h-[25%]" :
                h >= 10 ? "h-[10%]" : "h-[5%]";
              return (
                <div
                  key={i}
                  className={`rounded-t bg-primary-foreground/30 ${heightClass} ${h === 0 ? "opacity-30" : ""}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-card p-6 shadow-soft">
        <div className="mb-4 font-display text-lg font-semibold">Recent bookings</div>
        {(bookings as any[]).length === 0 ? (
          <p className="text-sm text-muted-foreground">No bookings assigned yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="py-2">ID</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {(bookings as any[]).map((b: any) => (
                  <tr key={b.id} className="border-t">
                    <td className="py-3 font-mono text-xs">{b.id.slice(0, 8)}…</td>
                    <td>{b.service?.title}</td>
                    <td>{b.date}</td>
                    <td><StatusBadge status={b.status} /></td>
                    <td className="text-right font-semibold">${b.service?.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardShell>
  );
};

export default ProviderDashboard;
