import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { providers } from "@/data/mock";
import { BadgeCheck, Star, Search, MoreVertical } from "lucide-react";

const AdminProviders = () => (
  <DashboardShell variant="admin" title="Providers" subtitle="Approve, verify, and manage service providers.">
    <div className="rounded-2xl border bg-card shadow-soft">
      <div className="flex flex-wrap items-center gap-3 border-b p-4">
        <div className="flex flex-1 items-center gap-2 rounded-lg border bg-background px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search providers..." className="border-0 shadow-none focus-visible:ring-0" />
        </div>
        <select className="rounded-lg border bg-background px-3 py-2 text-sm"><option>All categories</option></select>
        <select className="rounded-lg border bg-background px-3 py-2 text-sm"><option>All statuses</option></select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
            <tr><th className="px-4 py-3">Provider</th><th>Category</th><th>Area</th><th>Rating</th><th>Verified</th><th>Status</th><th className="text-right pr-4">Actions</th></tr>
          </thead>
          <tbody>
            {[...providers, ...providers].map((p, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full gradient-soft text-xl">{p.img}</div><div><div className="font-medium">{p.name}</div><div className="text-xs text-muted-foreground">{p.exp}</div></div></div></td>
                <td className="capitalize">{p.category}</td>
                <td>{p.area}</td>
                <td><span className="inline-flex items-center gap-1 text-warning"><Star className="h-3.5 w-3.5 fill-current" /> {p.rating}</span></td>
                <td>{p.verified ? <span className="inline-flex items-center gap-1 text-primary"><BadgeCheck className="h-4 w-4" /> Verified</span> : <span className="text-muted-foreground">Pending</span>}</td>
                <td><span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">Active</span></td>
                <td className="pr-4 text-right">
                  <Button size="sm" variant="outline">View</Button>
                  <Button size="icon" variant="ghost"><MoreVertical className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </DashboardShell>
);

export default AdminProviders;
