import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Sparkles,
  Wrench,
  Paintbrush,
  PaintRoller,
  Zap,
  Droplets,
  Hammer,
  Scissors,
  Leaf,
  Brush,
  Plug,
  Lightbulb,
  Fan,
  Truck,
  Home,
  Car,
  Bug,
  TreePine,
  Shirt,
  Snowflake,
  Flame,
  Lock,
  Key,
  Sofa,
  Bath,
  Drill,
  AirVent,
  Package,
  Refrigerator,
  WashingMachine,
  Laptop,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Sparkles,
  Wrench,
  Paintbrush,
  PaintRoller,
  Zap,
  Droplets,
  Hammer,
  Scissors,
  Leaf,
  Brush,
  Plug,
  Lightbulb,
  Fan,
  Truck,
  Home,
  Car,
  Bug,
  TreePine,
  Shirt,
  Snowflake,
  Flame,
  Lock,
  Key,
  Sofa,
  Bath,
  Drill,
  AirVent,
  Package,
  Refrigerator,
  WashingMachine,
  Laptop,
  Smartphone,
};

const COLOR_OPTIONS = [
  "from-blue-500 to-cyan-400",
  "from-orange-500 to-amber-400",
  "from-purple-500 to-pink-400",
  "from-yellow-500 to-orange-400",
  "from-cyan-500 to-blue-400",
  "from-slate-500 to-slate-400",
  "from-rose-500 to-red-400",
  "from-green-500 to-emerald-400",
  "from-indigo-500 to-violet-400",
  "from-teal-500 to-green-400",
];

type CategoryForm = { name: string; icon: string; color: string };

const emptyForm: CategoryForm = {
  name: "",
  icon: "Sparkles",
  color: COLOR_OPTIONS[0],
};

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((res) => res.data),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["categories"] });

  const createCategory = useMutation({
    mutationFn: (body: CategoryForm) => api.post("/categories", body),
    onSuccess: () => {
      invalidate();
      setDialogOpen(false);
      toast.success("Category created");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to create category"),
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<CategoryForm> & { isActive?: boolean } }) =>
      api.patch(`/categories/${id}`, body),
    onSuccess: () => {
      invalidate();
      setDialogOpen(false);
      toast.success("Category updated");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to update category"),
  });

  const toggleCategory = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch(`/categories/${id}`, { isActive }),
    onSuccess: invalidate,
    onError: () => toast.error("Failed to update category"),
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      invalidate();
      setDeleteTarget(null);
      toast.success("Category deleted");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to delete category"),
  });

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (c: any) => {
    setEditingId(c.id);
    setForm({
      name: c.name || "",
      icon: c.icon && CATEGORY_ICONS[c.icon] ? c.icon : "Sparkles",
      color: c.color || COLOR_OPTIONS[0],
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    const body = { ...form, name: form.name.trim() };
    if (editingId) updateCategory.mutate({ id: editingId, body });
    else createCategory.mutate(body);
  };

  const isSaving = createCategory.isPending || updateCategory.isPending;

  if (isLoading) return <div>Loading...</div>;

  return (
    <DashboardShell
      variant="admin"
      title="Categories"
      subtitle="Manage service categories."
      actions={
        <Button variant="hero" onClick={openAdd}>
          <Plus /> Add category
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(categories as any[]).map((c: any) => {
          const Icon = CATEGORY_ICONS[c.icon] || Sparkles;
          return (
            <div key={c.id} className="rounded-2xl border bg-card p-5 shadow-soft">
              <div
                className={`mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${c.color || "from-slate-500 to-slate-400"} text-white`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="font-display text-lg font-semibold">{c.name}</div>
              <div className="text-xs text-muted-foreground">
                {c.services?.length || 0} services
              </div>
              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <Switch
                  checked={c.isActive !== false}
                  disabled={toggleCategory.isPending}
                  onCheckedChange={(checked) =>
                    toggleCategory.mutate({ id: c.id, isActive: checked })
                  }
                />
                <div>
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Edit category"
                    onClick={() => openEdit(c)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    title="Delete category"
                    onClick={() => setDeleteTarget(c)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit category" : "Add category"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="category-name">Name</Label>
              <Input
                id="category-name"
                className="mt-1.5"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. AC Repair"
                required
              />
            </div>

            <div>
              <span className="text-sm font-medium leading-none">Icon</span>
              <div className="mt-1.5 grid max-h-44 grid-cols-8 gap-2 overflow-y-auto rounded-xl border p-3">
                {Object.entries(CATEGORY_ICONS).map(([name, Icon]) => (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => setForm({ ...form, icon: name })}
                    className={`grid h-9 w-9 place-items-center rounded-lg border transition-colors ${
                      form.icon === name
                        ? "border-primary bg-primary/10 text-primary"
                        : "hover:bg-secondary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-sm font-medium leading-none">Color</span>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    title={color}
                    onClick={() => setForm({ ...form, color })}
                    className={`h-8 w-8 rounded-lg bg-gradient-to-br ${color} ${
                      form.color === color
                        ? "ring-2 ring-primary ring-offset-2"
                        : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="flex items-center gap-3 rounded-xl border bg-secondary/30 p-3">
              <div
                className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${form.color} text-white`}
              >
                {(() => {
                  const Icon = CATEGORY_ICONS[form.icon] || Sparkles;
                  return <Icon className="h-5 w-5" />;
                })()}
              </div>
              <div className="text-sm font-medium">
                {form.name || "Category preview"}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="hero" disabled={isSaving}>
                {isSaving ? "Saving..." : editingId ? "Save changes" : "Create category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              Services in this category will become uncategorized. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteCategory.mutate(deleteTarget.id)}
            >
              {deleteCategory.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  );
};

export default AdminCategories;
