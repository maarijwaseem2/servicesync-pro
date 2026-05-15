import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Plus, Search, MoreVertical } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STAGE_COLORS, statusToStage, bookingSource } from "@/lib/crm";

const Leads = () => {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => api.get("/bookings").then((res) => res.data),
  });

  const leads = bookings.map((b: any) => ({
    id: b.id,
    name: b.customer?.name || "Unknown",
    email: b.customer?.email || "",
    contact: b.customer?.email || b.customer?.name || "",
    source: bookingSource(b.id),
    stage: statusToStage(b.status),
    owner: b.provider?.name || "Unassigned",
    value: Number(b.service?.price) || 0,
    service: b.service?.title || "",
    nextFollowUp: b.date ? new Date(b.date).toLocaleDateString() : "—",
  }));

  if (isLoading) return <div>Loading...</div>;

  return (
    <DashboardShell
      variant="crm"
      title="Leads"
      subtitle="Track and manage all your sales leads."
      actions={
        <Button variant="hero">
          <Plus /> Add lead
        </Button>
      }
    >
      <div className="rounded-2xl border bg-card shadow-soft">
        <div className="flex items-center gap-3 border-b p-4">
          <div className="flex flex-1 items-center gap-2 rounded-lg border bg-background px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              className="border-0 shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Lead</th>
                <th>Service</th>
                <th>Source</th>
                <th>Stage</th>
                <th>Owner</th>
                <th>Value</th>
                <th>Follow-up</th>
                <th className="pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l: any) => (
                <tr key={l.id} className="border-t hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="font-medium">{l.name}</div>
                    <div className="text-xs text-muted-foreground">{l.email}</div>
                  </td>
                  <td className="text-muted-foreground">{l.service}</td>
                  <td>{l.source}</td>
                  <td>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STAGE_COLORS[l.stage]}`}
                    >
                      {l.stage}
                    </span>
                  </td>
                  <td>{l.owner}</td>
                  <td className="font-semibold">${l.value.toLocaleString()}</td>
                  <td className="text-muted-foreground">{l.nextFollowUp}</td>
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

export default Leads;
