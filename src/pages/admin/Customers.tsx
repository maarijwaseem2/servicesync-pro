import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Search, X, ClipboardList, CheckCircle2, XCircle } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";

const AdminCustomers = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => api.get("/users").then((r) => r.data),
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => api.get("/bookings").then((r) => r.data),
  });

  const customers = users
    .filter((u: any) => u.role === "CUSTOMER")
    .filter(
      (u: any) =>
        !search ||
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()),
    )
    .map((u: any) => {
      const userBookings = bookings.filter(
        (b: any) => b.customer?.id === u.id || b.customerId === u.id,
      );
      return {
        ...u,
        bookingCount: userBookings.length,
        completedCount: userBookings.filter(
          (b: any) => b.status === "COMPLETED",
        ).length,
        recentBookings: userBookings.slice(0, 5),
      };
    });

  const initials = (name: string) =>
    (name || "?")
      .split(" ")
      .map((x: string) => x[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  if (isLoading) return <div>Loading...</div>;

  return (
    <DashboardShell
      variant="admin"
      title="Customers"
      subtitle="View and manage all registered customers."
    >
      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 rounded-2xl border bg-card shadow-soft overflow-hidden">
          <div className="flex items-center gap-3 border-b p-4">
            <div className="flex flex-1 items-center gap-2 rounded-lg border bg-background px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers..."
                className="border-0 shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Bookings</th>
                  <th>Completed</th>
                  <th className="pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      No customers found.
                    </td>
                  </tr>
                )}
                {customers.map((c: any) => (
                  <tr
                    key={c.id}
                    className={`border-t transition-colors ${selected?.id === c.id ? "bg-primary/5" : "hover:bg-secondary/30"}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-full gradient-hero text-sm font-bold text-primary-foreground shrink-0">
                          {initials(c.name)}
                        </div>
                        <div className="font-medium">{c.name || "—"}</div>
                      </div>
                    </td>
                    <td className="text-muted-foreground">{c.email}</td>
                    <td>{c.phoneNumber || "—"}</td>
                    <td className="font-semibold">{c.bookingCount}</td>
                    <td>
                      <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                        {c.completedCount} done
                      </span>
                    </td>
                    <td className="pr-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setSelected(selected?.id === c.id ? null : c)
                        }
                      >
                        {selected?.id === c.id ? "Close" : "View"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-80 shrink-0 rounded-2xl border bg-card shadow-soft overflow-hidden">
            <div className="flex items-center justify-between border-b p-4">
              <div className="font-display font-semibold">Customer record</div>
              <button
                type="button"
                title="Close"
                onClick={() => setSelected(null)}
                className="rounded-lg p-1 hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex flex-col items-center text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full gradient-hero text-2xl font-bold text-primary-foreground">
                  {initials(selected.name)}
                </div>
                <div className="mt-2 font-display text-lg font-semibold">
                  {selected.name || "—"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {selected.email}
                </div>
                {selected.phoneNumber && (
                  <div className="text-sm text-muted-foreground">
                    {selected.phoneNumber}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-xl bg-secondary p-3">
                  <ClipboardList className="mx-auto h-4 w-4 text-primary" />
                  <div className="mt-1 font-bold">{selected.bookingCount}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div className="rounded-xl bg-secondary p-3">
                  <CheckCircle2 className="mx-auto h-4 w-4 text-success" />
                  <div className="mt-1 font-bold">{selected.completedCount}</div>
                  <div className="text-xs text-muted-foreground">Done</div>
                </div>
                <div className="rounded-xl bg-secondary p-3">
                  <XCircle className="mx-auto h-4 w-4 text-destructive" />
                  <div className="mt-1 font-bold">
                    {
                      selected.recentBookings.filter(
                        (b: any) => b.status === "CANCELLED",
                      ).length
                    }
                  </div>
                  <div className="text-xs text-muted-foreground">Cancelled</div>
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Recent bookings
                </div>
                {selected.recentBookings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No bookings yet.</p>
                ) : (
                  <div className="space-y-2">
                    {selected.recentBookings.map((b: any) => (
                      <div
                        key={b.id}
                        className="flex items-center justify-between rounded-lg border p-2 text-sm"
                      >
                        <div>
                          <div className="font-medium">
                            {b.service?.title || "Service"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {b.date || "—"}
                          </div>
                        </div>
                        <StatusBadge status={b.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
};

export default AdminCustomers;
