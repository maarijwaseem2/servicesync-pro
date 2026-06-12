import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Calendar, Mail, User as UserIcon, ChevronDown, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardShell } from "@/components/DashboardShell";
import { StatusBadge } from "@/components/StatusBadge";

const tabs = ["All", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;
const tabLabels: Record<string, string> = {
  All: "All",
  PENDING: "Pending",
  CONFIRMED: "Accepted",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const ProviderBookings = () => {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["provider-bookings"],
    queryFn: () => api.get("/bookings").then((res) => res.data),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/bookings/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["provider-bookings"] }),
  });

  const list = bookings.filter((b: any) => tab === "All" || b.status === tab);

  if (isLoading) return <div>Loading...</div>;

  return (
    <DashboardShell
      variant="provider"
      title="Assigned jobs"
      subtitle="Accept, manage, and complete your bookings."
    >
      <div className="flex gap-2 overflow-x-auto border-b">
        {tabs.map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "relative whitespace-nowrap px-4 py-3 text-sm font-medium",
              tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tabLabels[t]}
            {tab === t && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {list.length === 0 && (
          <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
            No bookings found.
          </div>
        )}
        {list.map((b: any) => (
          <div key={b.id} className="rounded-2xl border bg-card p-5 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-display text-lg font-semibold">
                  {b.service?.title}
                </div>
                <button
                  type="button"
                  onClick={() => setOpenId(openId === b.id ? null : b.id)}
                  className="mt-0.5 flex items-center gap-1 text-sm text-primary hover:underline"
                  title="View customer details"
                >
                  <UserIcon className="h-3.5 w-3.5" />
                  <span className="capitalize">{b.customer?.name || "Customer"}</span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      openId === b.id && "rotate-180",
                    )}
                  />
                </button>
              </div>
              <StatusBadge status={b.status} />
            </div>

            {openId === b.id && (
              <div className="mt-4 rounded-xl border bg-secondary/30 p-4">
                <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Customer details
                </div>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-primary" />
                    <span className="capitalize">{b.customer?.name || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    {b.customer?.email || "—"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    {b.phone || b.customer?.phoneNumber || "No phone"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    {b.city || b.customer?.city || "—"}
                  </div>
                  <div className="flex items-start gap-2 sm:col-span-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {b.address || b.customer?.address || "Address not provided"}
                  </div>
                  {b.specialInstructions && (
                    <div className="sm:col-span-2 rounded-lg bg-background p-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Notes: </span>
                      {b.specialInstructions}
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                {b.date} · {b.time}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                {[b.address, b.city].filter(Boolean).join(", ") ||
                  b.customer?.address ||
                  "Location TBD"}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                {b.phone || b.customer?.phoneNumber || "No phone"}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
              {b.status === "PENDING" && (
                <Button
                  size="sm"
                  variant="hero"
                  onClick={() => updateStatus.mutate({ id: b.id, status: "CONFIRMED" })}
                >
                  Accept job
                </Button>
              )}
              {b.status === "CONFIRMED" && (
                <Button
                  size="sm"
                  variant="accent"
                  onClick={() => updateStatus.mutate({ id: b.id, status: "COMPLETED" })}
                >
                  Mark complete
                </Button>
              )}
              {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => updateStatus.mutate({ id: b.id, status: "CANCELLED" })}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
};

export default ProviderBookings;
