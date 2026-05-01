import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { categories } from "@/data/mock";
import { Plus, Pencil, Trash2 } from "lucide-react";

const AdminCategories = () => (
  <DashboardShell variant="admin" title="Categories" subtitle="Manage service categories." actions={<Button variant="hero"><Plus /> Add category</Button>}>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map(c => (
        <div key={c.id} className="rounded-2xl border bg-card p-5 shadow-soft">
          <div className={`mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${c.color} text-white`}><c.icon className="h-6 w-6" /></div>
          <div className="font-display text-lg font-semibold">{c.name}</div>
          <div className="text-xs text-muted-foreground">{c.count} services</div>
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <Switch defaultChecked />
            <div>
              <Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </DashboardShell>
);

export default AdminCategories;
