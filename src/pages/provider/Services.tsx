import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getServiceImage } from "@/lib/utils";

type ServiceForm = {
  title: string;
  description: string;
  price: string;
  duration: string;
  categoryId: string;
};

const empty: ServiceForm = {
  title: "",
  description: "",
  price: "",
  duration: "",
  categoryId: "",
};

const ProviderServices = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ServiceForm>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((r) => r.data),
  });

  const { data: allServices = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => api.get("/services").then((r) => r.data),
  });

  const createService = useMutation({
    mutationFn: (body: object) => api.post("/services", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setShowForm(false);
      setForm(empty);
      setEditId(null);
      setError("");
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || "Failed to save service.");
    },
  });

  const deleteService = useMutation({
    mutationFn: (id: string) => api.delete(`/services/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["services"] }),
    onError: (err: any) => {
      setError(err?.response?.data?.message || "Failed to delete service.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.title || !form.price || !form.categoryId) {
      setError("Title, price, and category are required.");
      return;
    }
    createService.mutate({
      title: form.title,
      description: form.description,
      price: Number(form.price),
      duration: form.duration,
      categoryId: form.categoryId,
    });
  };

  const openAdd = () => {
    setForm(empty);
    setEditId(null);
    setError("");
    setShowForm(true);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <DashboardShell
      variant="provider"
      title="My Services"
      subtitle="Manage the services you offer to customers."
      actions={
        <Button variant="hero" onClick={openAdd}>
          <Plus /> Add service
        </Button>
      }
    >
      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-elevated">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">
                {editId ? "Edit service" : "Add new service"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-1 hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <p className="mb-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Title</label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. AC Installation"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe what this service includes..."
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Price ($)</label>
                  <Input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="e.g. 80"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Duration</label>
                  <Input
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="e.g. 2 hours"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  variant="hero"
                  className="flex-1"
                  disabled={createService.isPending}
                >
                  {createService.isPending ? "Saving..." : "Save service"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Services list */}
      {allServices.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
          <p className="text-lg font-medium">No services yet</p>
          <p className="mt-1 text-sm">Click "Add service" to create your first one.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {allServices.map((s: any) => (
            <div
              key={s.id}
              className="overflow-hidden rounded-2xl border bg-card shadow-soft"
            >
              <div className="h-36 overflow-hidden">
                <img
                  src={s.imageUrl || getServiceImage(s.title, s.category?.name || "")}
                  alt={s.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-display font-semibold">{s.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {s.category?.name || "Uncategorized"}
                    </div>
                  </div>
                  <div className="shrink-0 font-bold text-primary">${s.price}</div>
                </div>
                {s.description && (
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                    {s.description}
                  </p>
                )}
                <div className="mt-3 flex gap-2 border-t pt-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => deleteService.mutate(s.id)}
                    disabled={deleteService.isPending}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
};

export default ProviderServices;
