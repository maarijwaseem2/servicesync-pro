import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  BadgeCheck,
  Star,
  Search,
  X,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Check,
  Trash2,
  Clock,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
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

const providerStatusBadge = (status?: string) => {
  if (status === "APPROVED")
    return (
      <span className="inline-flex items-center gap-1 text-primary">
        <BadgeCheck className="h-4 w-4" /> Approved
      </span>
    );
  if (status === "REJECTED")
    return (
      <span className="inline-flex items-center gap-1 text-destructive">
        <XCircle className="h-4 w-4" /> Rejected
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-yellow-600">
      <Clock className="h-4 w-4" /> Pending
    </span>
  );
};

const AdminProviders = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => api.get("/users").then((r) => r.data),
  });

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/users/${id}/provider-status`, { status }),
    onSuccess: (_res, vars) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success(
        vars.status === "APPROVED" ? "Provider approved" : "Provider rejected",
      );
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to update provider"),
  });

  const deleteProvider = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setDeleteTarget(null);
      setSelected(null);
      toast.success("Provider deleted");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to delete provider"),
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => api.get("/bookings").then((r) => r.data),
  });

  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: () => api.get("/services").then((r) => r.data),
  });

  const providers = users
    .filter((u: any) => u.role === "PROVIDER")
    .filter(
      (u: any) =>
        !search ||
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()),
    )
    .map((u: any) => {
      const providerBookings = bookings.filter(
        (b: any) => b.provider?.id === u.id || b.providerId === u.id,
      );
      const completed = providerBookings.filter(
        (b: any) => b.status === "COMPLETED",
      ).length;
      const cancelled = providerBookings.filter(
        (b: any) => b.status === "CANCELLED",
      ).length;
      const total = providerBookings.length;

      // Rating: from API if available, else compute from completion rate (4.0–5.0 range)
      const computedRating =
        u.rating != null
          ? Number(u.rating).toFixed(1)
          : total > 0
            ? (4 + completed / Math.max(total, 1)).toFixed(1)
            : null;

      // Specialty from their services
      const providerServices = services.filter(
        (s: any) => s.provider?.id === u.id || s.providerId === u.id,
      );
      const specialty =
        u.category ||
        u.specialty ||
        providerServices[0]?.category?.name ||
        "General";

      return {
        ...u,
        providerBookings,
        completedCount: completed,
        cancelledCount: cancelled,
        totalJobs: total,
        rating: computedRating,
        specialty,
        recentBookings: providerBookings.slice(0, 5),
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
      title="Providers"
      subtitle="View and manage all service providers."
    >
      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 rounded-2xl border bg-card shadow-soft overflow-hidden">
          <div className="flex items-center gap-3 border-b p-4">
            <div className="flex flex-1 items-center gap-2 rounded-lg border bg-background px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                name="search-providers"
                aria-label="Search providers"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search providers..."
                className="border-0 shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Provider</th>
                  <th>Specialty</th>
                  <th>Area</th>
                  <th>Rating</th>
                  <th>Jobs</th>
                  <th>Status</th>
                  <th className="pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {providers.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      No providers found.
                    </td>
                  </tr>
                )}
                {providers.map((p: any) => (
                  <tr
                    key={p.id}
                    className={`border-t transition-colors ${selected?.id === p.id ? "bg-primary/5" : "hover:bg-secondary/30"}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full gradient-soft text-sm font-bold shrink-0">
                          {initials(p.name)}
                        </div>
                        <div>
                          <div className="font-medium">{p.name || "—"}</div>
                          <div className="text-xs text-muted-foreground">
                            {p.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="capitalize">{p.specialty}</td>
                    <td>{p.serviceArea || p.area || "—"}</td>
                    <td>
                      {p.rating ? (
                        <span className="inline-flex items-center gap-1 text-warning">
                          <Star className="h-3.5 w-3.5 fill-current" />{" "}
                          {p.rating}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          No jobs yet
                        </span>
                      )}
                    </td>
                    <td className="font-semibold">{p.totalJobs}</td>
                    <td>{providerStatusBadge(p.providerStatus)}</td>
                    <td className="pr-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        {p.providerStatus !== "APPROVED" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:text-green-700"
                            title="Approve provider"
                            disabled={setStatus.isPending}
                            onClick={() =>
                              setStatus.mutate({ id: p.id, status: "APPROVED" })
                            }
                          >
                            <Check className="h-4 w-4" /> Approve
                          </Button>
                        )}
                        {p.providerStatus !== "REJECTED" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            title="Reject provider"
                            disabled={setStatus.isPending}
                            onClick={() =>
                              setStatus.mutate({ id: p.id, status: "REJECTED" })
                            }
                          >
                            <X className="h-4 w-4" /> Reject
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          title="Delete provider"
                          onClick={() => setDeleteTarget(p)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setSelected(selected?.id === p.id ? null : p)
                          }
                        >
                          {selected?.id === p.id ? "Close" : "View"}
                        </Button>
                      </div>
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
              <div className="font-display font-semibold">Provider record</div>
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
                <div className="mt-1 text-sm">
                  {providerStatusBadge(selected.providerStatus)}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-xl bg-secondary p-3">
                  <ClipboardList className="mx-auto h-4 w-4 text-primary" />
                  <div className="mt-1 font-bold">{selected.totalJobs}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div className="rounded-xl bg-secondary p-3">
                  <CheckCircle2 className="mx-auto h-4 w-4 text-success" />
                  <div className="mt-1 font-bold">{selected.completedCount}</div>
                  <div className="text-xs text-muted-foreground">Done</div>
                </div>
                <div className="rounded-xl bg-secondary p-3">
                  <Star className="mx-auto h-4 w-4 text-warning" />
                  <div className="mt-1 font-bold">
                    {selected.rating ?? "—"}
                  </div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
              </div>

              {selected.cancelledCount > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  <XCircle className="h-4 w-4" />
                  {selected.cancelledCount} cancelled bookings
                </div>
              )}

              <div>
                <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Recent jobs
                </div>
                {selected.recentBookings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No jobs yet.</p>
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
                            {b.customer?.name || "Customer"} · {b.date || "—"}
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

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete provider "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the account along with the provider's
              services and related bookings. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteProvider.mutate(deleteTarget.id)}
            >
              {deleteProvider.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  );
};

export default AdminProviders;
