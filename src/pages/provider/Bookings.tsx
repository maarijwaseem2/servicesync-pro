import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Calendar } from "lucide-react";
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
                <div className="text-sm text-muted-foreground">
                  {b.customer?.name || "Customer"}
                </div>
              </div>
              <StatusBadge status={b.status} />
            </div>
            <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                {b.date} · {b.time}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                {b.specialInstructions || "Location TBD"}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                {b.customer?.phoneNumber || "No phone"}
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
