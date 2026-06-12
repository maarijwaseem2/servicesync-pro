import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, assetUrl } from "@/lib/api";
import { toast } from "sonner";
import { Check, X, Trash2, Search, Plus, Pencil, ImagePlus } from "lucide-react";

import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
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

type ServiceForm = {
  title: string;
  description: string;
  price: string;
  categoryId: string;
};

const emptyForm: ServiceForm = { title: "", description: "", price: "", categoryId: "" };

const statusBadge = (status: string) => {
  if (status === "pending")
    return <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">Pending</span>;
  if (status === "rejected")
    return <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Rejected</span>;
  return <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Active</span>;
};

const AdminServices = () => {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"all" | "pending">("all");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: remoteCategories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((r) => r.data),
  });

  const { data: remoteServices = [], isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: () => api.get("/services/admin/all").then((r) => r.data),
  });

  const approve = useMutation({
    mutationFn: (id: string) => api.patch(`/services/${id}/approve`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-services"] }),
  });

  const reject = useMutation({
    mutationFn: (id: string) => api.patch(`/services/${id}/reject`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-services"] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      setDeleteTarget(null);
      toast.success("Service deleted");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to delete service"),
  });

  const uploadImage = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append("image", file);
      return api.post<{ imageUrl: string }>("/services/upload-image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  });

  const saveService = useMutation({
    mutationFn: ({ id, body }: { id: string | null; body: object }) =>
      id ? api.patch(`/services/${id}`, body) : api.post("/services", body),
    onSuccess: (_res, vars) => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      closeDialog();
      toast.success(vars.id ? "Service updated" : "Service created");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to save service"),
  });

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setDialogOpen(true);
  };

  const openEdit = (s: any) => {
    setEditingId(s.id);
    setForm({
      title: s.title || "",
      description: s.description || "",
      price: String(s.price ?? ""),
      categoryId: s.category?.id || "",
    });
    setImageFile(null);
    setImagePreview(s.imageUrl ? assetUrl(s.imageUrl) : null);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.price || !form.categoryId) {
      toast.error("Title, price, and category are required.");
      return;
    }
    let imageUrl: string | undefined;
    if (imageFile) {
      try {
        const res = await uploadImage.mutateAsync(imageFile);
        imageUrl = res.data.imageUrl;
      } catch {
        toast.error("Image upload failed. Please try again.");
        return;
      }
    }
    saveService.mutate({
      id: editingId,
      body: {
        title: form.title.trim(),
        description: form.description,
        price: Number(form.price),
        categoryId: form.categoryId,
        ...(imageUrl ? { imageUrl } : {}),
      },
    });
  };

  const isSaving = uploadImage.isPending || saveService.isPending;

  const servicesList = (remoteServices as any[])
    .map((s: any) => ({
      ...s,
      name: s.title,
      img: s.imageUrl ? assetUrl(s.imageUrl) : "/assets/deep-cleaning.jfif",
      categoryName: s.category?.name || "Uncategorized",
    }))
    .filter((s) => {
      if (tab === "pending" && s.status !== "pending") return false;
      if (catFilter && s.category?.id !== catFilter) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

  const pendingCount = (remoteServices as any[]).filter((s: any) => s.status === "pending").length;

  if (isLoading) return <div>Loading...</div>;

  return (
    <DashboardShell
      variant="admin"
      title="Manage services"
      subtitle="Review pending submissions and manage the active service catalog."
      actions={
        <Button variant="hero" onClick={openAdd}>
          <Plus /> Add service
        </Button>
      }
    >
      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("all")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === "all" ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"}`}
        >
          All services
        </button>
        <button
          type="button"
          onClick={() => setTab("pending")}
          className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === "pending" ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"}`}
        >
          Pending approval
          {pendingCount > 0 && (
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      <div className="rounded-2xl border bg-card shadow-soft">
        <div className="flex flex-wrap items-center gap-3 border-b p-4">
          <div className="flex flex-1 items-center gap-2 rounded-lg border bg-background px-3 min-w-[240px]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              name="search-services"
              aria-label="Search services"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="border-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <select
            id="category-filter"
            name="category-filter"
            title="Filter by category"
            aria-label="Filter by category"
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="rounded-lg border bg-background px-3 py-2 text-sm"
          >
            <option value="">All categories</option>
            {(remoteCategories as any[]).map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {servicesList.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            {tab === "pending" ? "No services pending approval." : "No services found."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Service</th>
                  <th>Provider</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th className="pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {servicesList.map((s: any) => (
                  <tr key={s.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border">
                          <img src={s.img} alt={s.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <div className="font-medium">{s.name}</div>
                          <div className="max-w-[200px] truncate text-xs text-muted-foreground">
                            {s.description || "No description."}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-xs text-muted-foreground">
                      {s.provider?.name || "—"}
                    </td>
                    <td className="capitalize">{s.categoryName}</td>
                    <td className="font-semibold">${s.price}</td>
                    <td>{statusBadge(s.status)}</td>
                    <td className="pr-4 text-right">
                      {s.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:text-green-700"
                            title="Approve"
                            onClick={() => approve.mutate(s.id)}
                            disabled={approve.isPending}
                          >
                            <Check className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            title="Reject"
                            onClick={() => reject.mutate(s.id)}
                            disabled={reject.isPending}
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Edit"
                        onClick={() => openEdit(s)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        title="Delete"
                        onClick={() => setDeleteTarget(s)}
                        disabled={remove.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit service" : "Add service"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Service image</Label>
              <div
                className="relative mt-1.5 flex min-h-[120px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-input bg-secondary/30 transition-colors hover:bg-secondary/50"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="h-32 w-full object-cover" />
                    <button
                      type="button"
                      aria-label="Remove image"
                      className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageFile(null);
                        setImagePreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      <X className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
                    <ImagePlus className="h-8 w-8" />
                    <span className="text-sm">Click to upload image</span>
                    <span className="text-xs">PNG, JPG up to 5 MB</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                title="Upload service image"
                aria-label="Upload service image"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            <div>
              <Label htmlFor="svc-title">Title</Label>
              <Input
                id="svc-title"
                className="mt-1.5"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. AC Installation"
                required
              />
            </div>

            <div>
              <Label htmlFor="svc-desc">Description</Label>
              <textarea
                id="svc-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe what this service includes..."
                rows={3}
                className="mt-1.5 flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="svc-price">Price ($)</Label>
                <Input
                  id="svc-price"
                  className="mt-1.5"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. 80"
                  required
                />
              </div>
              <div>
                <Label htmlFor="svc-category">Category</Label>
                <select
                  id="svc-category"
                  title="Service category"
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                >
                  <option value="">Select category</option>
                  {(remoteCategories as any[]).map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" variant="hero" disabled={isSaving}>
                {uploadImage.isPending
                  ? "Uploading image..."
                  : saveService.isPending
                  ? "Saving..."
                  : editingId
                  ? "Save changes"
                  : "Create service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.title}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the service from the catalog. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => remove.mutate(deleteTarget.id)}
            >
              {remove.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  );
};

export default AdminServices;
