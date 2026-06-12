import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Check,
  Trash2,
} from "lucide-react";

import { DashboardShell } from "@/components/DashboardShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminBookings = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => api.get("/bookings").then((res) => res.data),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/bookings/${id}/status`, { status }),
    onSuccess: (_res, vars) => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      toast.success(`Booking marked as ${vars.status.toLowerCase()}`);
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to update booking"),
  });

  const deleteBooking = useMutation({
    mutationFn: (id: string) => api.delete(`/bookings/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      setDeleteTarget(null);
      toast.success("Booking deleted");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to delete booking"),
  });

  const filtered = (bookings as any[]).filter((b: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.customer?.name?.toLowerCase().includes(q) ||
      b.provider?.name?.toLowerCase().includes(q) ||
      b.service?.title?.toLowerCase().includes(q) ||
      b.status?.toLowerCase().includes(q) ||
      b.id?.toLowerCase().includes(q)
    );
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
              name="search-bookings"
              aria-label="Search bookings"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No bookings found.
                  </td>
                </tr>
              )}
              {filtered.map((b: any) => (
                <tr key={b.id} className="border-t">
                  <td className="px-4 py-3 font-mono text-xs">
                    {b.id?.slice(0, 8)}...
                  </td>
                  <td className="capitalize">{b.customer?.name || "Customer"}</td>
                  <td>{b.service?.title}</td>
                  <td className="capitalize">{b.provider?.name || "Unassigned"}</td>
                  <td className="text-muted-foreground">{b.date}</td>
                  <td className="font-semibold">
                    ${b.totalAmount || b.service?.price}
                  </td>
                  <td>
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="pr-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" title="Booking actions">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {b.status === "PENDING" && (
                          <DropdownMenuItem
                            onClick={() =>
                              updateStatus.mutate({ id: b.id, status: "CONFIRMED" })
                            }
                          >
                            <Check className="h-4 w-4" /> Confirm booking
                          </DropdownMenuItem>
                        )}
                        {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                          <DropdownMenuItem
                            onClick={() =>
                              updateStatus.mutate({ id: b.id, status: "COMPLETED" })
                            }
                          >
                            <CheckCircle2 className="h-4 w-4" /> Mark completed
                          </DropdownMenuItem>
                        )}
                        {b.status !== "CANCELLED" && b.status !== "COMPLETED" && (
                          <DropdownMenuItem
                            onClick={() =>
                              updateStatus.mutate({ id: b.id, status: "CANCELLED" })
                            }
                          >
                            <XCircle className="h-4 w-4" /> Cancel booking
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteTarget(b)}
                        >
                          <Trash2 className="h-4 w-4" /> Delete booking
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Booking for "{deleteTarget?.service?.title}" by{" "}
              {deleteTarget?.customer?.name || "a customer"} will be permanently
              removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteBooking.mutate(deleteTarget.id)}
            >
              {deleteBooking.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  );
};

export default AdminBookings;
