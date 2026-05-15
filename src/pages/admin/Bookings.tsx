import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Search, MoreVertical } from "lucide-react";

import { DashboardShell } from "@/components/DashboardShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AdminBookings = () => {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => api.get("/bookings").then((res) => res.data),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <DashboardShell
      variant="admin"
      title="Bookings"
      subtitle="View and manage all customer bookings."
    >
      <div className="rounded-2xl border bg-card shadow-soft">
        <div className="flex items-center gap-3 border-b p-4">
          <div className="flex flex-1 items-center gap-2 rounded-lg border bg-background px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              className="border-0 shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Provider</th>
                <th>Date</th>
                <th>Price</th>
                <th>Status</th>
                <th className="pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: any) => (
                <tr key={b.id} className="border-t">
                  <td className="px-4 py-3 font-mono text-xs">
                    {b.id?.slice(0, 8)}...
                  </td>
                  <td>{b.customer?.name || "Customer"}</td>
                  <td>{b.service?.title}</td>
                  <td>{b.provider?.name || "Unassigned"}</td>
                  <td className="text-muted-foreground">{b.date}</td>
                  <td className="font-semibold">${b.service?.price}</td>
                  <td>
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="pr-4 text-right">
                    <Button size="icon" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
};

export default AdminBookings;
