import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Phone, Mail, MessageSquare, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/DashboardShell";

const FollowUps = () => {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => api.get("/bookings").then((res) => res.data),
  });

  const pending = bookings.filter(
    (b: any) => b.status === "PENDING" || b.status === "CONFIRMED",
  );

  const list = pending.map((b: any) => ({
    id: b.id,
    name: b.customer?.name || "Unknown",
    email: b.customer?.email || "",
    service: b.service?.title || "",
    nextFollowUp: b.date ? new Date(b.date).toLocaleDateString() : "—",
  }));

  // Count pending bookings per weekday (Mon–Fri this week)
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    const count = bookings.filter((b: any) => {
      if (!b.date) return false;
      const bd = new Date(b.date);
      return bd.toDateString() === day.toDateString();
    }).length;
    return { d, count };
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <DashboardShell
      variant="crm"
      title="Follow-ups"
      subtitle="Stay on top of every conversation."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {list.length === 0 && (
            <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
              No pending follow-ups
            </div>
          )}
          {list.slice(0, 5).map((l: any) => (
            <div key={l.id} className="rounded-2xl border bg-card p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-display text-lg font-semibold">{l.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {l.email || l.service}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  <Calendar className="h-3 w-3" /> {l.nextFollowUp}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="hero">
                  <Phone className="h-4 w-4" /> Call
                </Button>
                <Button size="sm" variant="outline">
                  <Mail className="h-4 w-4" /> Email
                </Button>
                <Button size="sm" variant="ghost">
                  <MessageSquare className="h-4 w-4" /> Note
                </Button>
                <Button size="sm" variant="ghost">
                  Reschedule
                </Button>
              </div>
            </div>
          ))}
        </div>
        <aside>
          <div className="rounded-2xl border bg-card p-6 shadow-soft">
            <div className="font-display font-semibold">This week</div>
            <div className="mt-3 space-y-2 text-sm">
              {weekDays.map(({ d, count }) => (
                <div
                  key={d}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <span className="font-medium">{d}</span>
                  <span className="text-muted-foreground">{count} bookings</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
};

export default FollowUps;
