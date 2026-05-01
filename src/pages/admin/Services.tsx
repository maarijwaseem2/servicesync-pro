import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { services, categories } from "@/data/mock";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

const AdminServices = () => (
  <DashboardShell variant="admin" title="Manage services" subtitle="Add, edit, and toggle services available on the platform." actions={<Button variant="hero"><Plus /> Add service</Button>}>
    <div className="rounded-2xl border bg-card shadow-soft">
      <div className="flex flex-wrap items-center gap-3 border-b p-4">
        <div className="flex flex-1 items-center gap-2 rounded-lg border bg-background px-3 min-w-[240px]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search services..." className="border-0 shadow-none focus-visible:ring-0" />
        </div>
        <select className="rounded-lg border bg-background px-3 py-2 text-sm">
          <option>All categories</option>
          {categories.map(c => <option key={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
            <tr><th className="px-4 py-3">Service</th><th>Category</th><th>Price</th><th>Duration</th><th>Status</th><th className="text-right pr-4">Actions</th></tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id} className="border-t">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg gradient-soft text-xl">{s.img}</div>
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1 max-w-[240px]">{s.desc}</div>
                    </div>
                  </div>
                </td>
                <td className="capitalize">{s.category}</td>
                <td className="font-semibold">${s.price}</td>
                <td>{s.duration}</td>
                <td><Switch defaultChecked /></td>
                <td className="pr-4 text-right">
                  <Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </DashboardShell>
);

export default AdminServices;
