import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { leads, leadSources } from "@/data/mock";
import { Plus, Search, MoreVertical } from "lucide-react";

const stageColors: Record<string, string> = {
  New: "bg-sky-500/15 text-sky-600",
  Contacted: "bg-violet-500/15 text-violet-600",
  Qualified: "bg-primary/10 text-primary",
  Proposal: "bg-warning/15 text-warning",
  Won: "bg-success/15 text-success",
  Lost: "bg-destructive/10 text-destructive",
};

const Leads = () => (
  <DashboardShell variant="crm" title="Leads" subtitle="All your leads in one place." actions={<Button variant="hero"><Plus /> New lead</Button>}>
    <div className="rounded-2xl border bg-card shadow-soft">
      <div className="flex flex-wrap items-center gap-3 border-b p-4">
        <div className="flex flex-1 items-center gap-2 rounded-lg border bg-background px-3 min-w-[200px]"><Search className="h-4 w-4 text-muted-foreground" /><Input placeholder="Search leads..." className="border-0 shadow-none focus-visible:ring-0" /></div>
        <select className="rounded-lg border bg-background px-3 py-2 text-sm"><option>All stages</option></select>
        <select className="rounded-lg border bg-background px-3 py-2 text-sm"><option>All sources</option>{leadSources.map(s => <option key={s}>{s}</option>)}</select>
        <select className="rounded-lg border bg-background px-3 py-2 text-sm"><option>All owners</option></select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3">Lead</th><th>Contact</th><th>Source</th><th>Stage</th><th>Owner</th><th>Value</th><th>Next follow-up</th><th className="pr-4 text-right">Actions</th></tr></thead>
          <tbody>
            {leads.map(l => (
              <tr key={l.id} className="border-t hover:bg-secondary/30">
                <td className="px-4 py-3"><div className="font-medium">{l.name}</div><div className="text-xs text-muted-foreground">{l.id}</div></td>
                <td><div>{l.contact}</div><div className="text-xs text-muted-foreground">{l.email}</div></td>
                <td>{l.source}</td>
                <td><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${stageColors[l.stage]}`}>{l.stage}</span></td>
                <td>{l.owner}</td>
                <td className="font-semibold">${l.value.toLocaleString()}</td>
                <td className="text-muted-foreground">{l.nextFollowUp}</td>
                <td className="pr-4 text-right"><Button size="icon" variant="ghost"><MoreVertical className="h-4 w-4" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </DashboardShell>
);

export default Leads;
