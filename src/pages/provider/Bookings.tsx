import { useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { bookings, type BookingStatus } from "@/data/mock";
import { Phone, MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs: ("All" | BookingStatus)[] = ["All", "Pending", "Accepted", "In Progress", "Completed", "Cancelled"];

const ProviderBookings = () => {
  const [tab, setTab] = useState<typeof tabs[number]>("All");
  const list = bookings.filter(b => tab === "All" || b.status === tab);
  return (
    <DashboardShell variant="provider" title="Assigned jobs" subtitle="Accept, manage, and complete your bookings.">
      <div className="flex gap-2 overflow-x-auto border-b">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn("relative whitespace-nowrap px-4 py-3 text-sm font-medium", tab === t ? "text-primary" : "text-muted-foreground")}>
            {t}{tab === t && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-4">
        {list.map(b => (
          <div key={b.id} className="rounded-2xl border bg-card p-5 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs text-muted-foreground">#{b.id}</div>
                <div className="font-display text-lg font-semibold">{b.service}</div>
                <div className="text-sm text-muted-foreground">Customer: Jane Cooper</div>
              </div>
              <StatusBadge status={b.status} />
            </div>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{b.date} · {b.time}</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{b.address}</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />+1 555 0101</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {b.status === "Pending" && (<><Button size="sm" variant="hero">Accept</Button><Button size="sm" variant="outline" className="text-destructive">Reject</Button></>)}
              {b.status === "Accepted" && <Button size="sm" variant="accent">Start job</Button>}
              {b.status === "In Progress" && <Button size="sm" variant="hero">Mark complete</Button>}
              <Button size="sm" variant="ghost">View details</Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
};

export default ProviderBookings;
