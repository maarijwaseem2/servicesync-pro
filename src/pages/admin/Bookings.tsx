import { DashboardShell } from "@/components/DashboardShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { bookings } from "@/data/mock";
import { Search, MoreVertical } from "lucide-react";

const AdminBookings = () => (
  <DashboardShell variant="admin" title="All bookings" subtitle="Search, filter, and manage every booking.">
    <div className="rounded-2xl border bg-card shadow-soft">
      <div className="flex flex-wrap items-center gap-3 border-b p-4">
        <div className="flex flex-1 items-center gap-2 rounded-lg border bg-background px-3 min-w-[200px]"><Search className="h-4 w-4 text-muted-foreground" /><Input placeholder="Search bookings..." className="border-0 shadow-none focus-visible:ring-0" /></div>
        <select className="rounded-lg border bg-background px-3 py-2 text-sm"><option>All statuses</option></select>
        <select className="rounded-lg border bg-background px-3 py-2 text-sm"><option>All services</option></select>
        <select className="rounded-lg border bg-background px-3 py-2 text-sm"><option>All providers</option></select>
        <Input type="date" className="w-[160px]" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3">ID</th><th>Customer</th><th>Service</th><th>Provider</th><th>Date</th><th>Price</th><th>Payment</th><th>Status</th><th className="pr-4 text-right">Actions</th></tr></thead>
          <tbody>
            {[...bookings, ...bookings].map((b, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-3 font-mono text-xs">{b.id}</td>
                <td>Jane Cooper</td>
                <td>{b.service}</td>
                <td>{b.provider}</td>
                <td className="text-muted-foreground">{b.date}</td>
                <td className="font-semibold">${b.price}</td>
                <td>{b.payment}</td>
                <td><StatusBadge status={b.status} /></td>
                <td className="pr-4 text-right"><Button size="icon" variant="ghost"><MoreVertical className="h-4 w-4" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </DashboardShell>
);

export default AdminBookings;
