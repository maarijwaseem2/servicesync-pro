import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { GripVertical } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { LeadStage, statusToStage, bookingSource } from "@/lib/crm";

const stages: LeadStage[] = ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"];

const stageStyle: Record<LeadStage, string> = {
  New: "border-t-sky-500",
  Contacted: "border-t-violet-500",
  Qualified: "border-t-primary",
  Proposal: "border-t-warning",
  Won: "border-t-success",
  Lost: "border-t-destructive",
};

const Pipeline = () => {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => api.get("/bookings").then((res) => res.data),
  });

  const leads = bookings.map((b: any) => ({
    id: b.id,
    name: b.customer?.name || "Unknown",
    contact: b.service?.title || b.customer?.email || "",
    source: bookingSource(b.id),
    stage: statusToStage(b.status),
    value: Number(b.service?.price) || 0,
  }));

  if (isLoading) return <div>Loading...</div>;

  return (
    <DashboardShell
      variant="crm"
      title="Sales pipeline"
      subtitle="Bookings grouped by their current status."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {stages.map((s) => {
          const items = leads.filter((l: { stage: LeadStage }) => l.stage === s);
          const total = items.reduce((sum: number, l: { value: number }) => sum + l.value, 0);
          return (
            <div
              key={s}
              className={`rounded-2xl border-t-4 bg-secondary/40 p-3 ${stageStyle[s]}`}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <div>
                  <div className="font-display font-semibold">{s}</div>
                  <div className="text-xs text-muted-foreground">
                    {items.length} · ${total.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {items.map((l: any) => (
                  <div
                    key={l.id}
                    className="cursor-grab rounded-xl border bg-card p-3 shadow-soft transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="font-medium">{l.name}</div>
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-xs text-muted-foreground">{l.contact}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                        {l.source}
                      </span>
                      <span className="text-sm font-bold">${l.value.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground">
                    No leads
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardShell>
  );
};

export default Pipeline;
