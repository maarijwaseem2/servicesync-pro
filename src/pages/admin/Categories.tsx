import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Plus,
  Pencil,
  Trash2,
  Sparkles,
  Wrench,
  Paintbrush,
  Zap,
  Droplets,
  Hammer,
  Scissors,
  Leaf,
  Search,
} from "lucide-react";

const iconMap: Record<string, any> = {
  Sparkles,
  Wrench,
  Paintbrush,
  Zap,
  Droplets,
  Hammer,
  Scissors,
  Leaf,
  Search,
};

import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const AdminCategories = () => {
  const { data: remoteCategories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    },
  });

  const categoriesList = remoteCategories.map((c: any) => ({
    ...c,
    icon: iconMap[c.icon] || Sparkles,
    count: c.services?.length || 0,
  }));

  if (isLoading) return <div>Loading...</div>;

  return (
    <DashboardShell
      variant="admin"
      title="Categories"
      subtitle="Manage service categories."
      actions={
        <Button variant="hero">
          <Plus /> Add category
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categoriesList.map((c: any) => (
          <div
            key={c.id}
            className="rounded-2xl border bg-card p-5 shadow-soft"
          >
            <div
              className={`mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${c.color || "from-slate-500 to-slate-400"} text-white`}
            >
              <c.icon className="h-6 w-6" />
            </div>
            <div className="font-display text-lg font-semibold">{c.name}</div>
            <div className="text-xs text-muted-foreground">
              {c.count} services
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <Switch defaultChecked />
              <div>
                <Button size="icon" variant="ghost">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
};

export default AdminCategories;
