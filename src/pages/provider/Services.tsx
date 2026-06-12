import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, assetUrl } from "@/lib/api";
import { Plus, Trash2, X, Clock, ImagePlus, Pencil } from "lucide-react";
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
  newCategoryName: string;
};

const empty: ServiceForm = {
  title: "",
  description: "",
  price: "",
  duration: "",
  categoryId: "",
  newCategoryName: "",
};

const statusBadge = (status: string) => {
  if (status === "pending")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
        <Clock className="h-3 w-3" /> Pending approval
      </span>
    );
  if (status === "rejected")
    return (
      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
        Rejected
      </span>
    );
  return (
    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
      Active
    </span>
  );
};

const ProviderServices = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceForm>(empty);
  const [error, setError] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((r) => r.data),
  });

  const { data: myServices = [], isLoading } = useQuery({
    queryKey: ["services", "mine"],
    queryFn: () => api.get("/services/mine").then((r) => r.data),
  });

  const createCategory = useMutation({
    mutationFn: (name: string) => api.post("/categories", { name }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setForm((f) => ({ ...f, categoryId: res.data.id, newCategoryName: "" }));
      setCreatingCategory(false);
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || "Failed to create category.");
    },
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services", "mine"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      closeForm();
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || "Failed to save service.");
    },
  });

  const deleteService = useMutation({
    mutationFn: (id: string) => api.delete(`/services/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["services", "mine"] }),
    onError: (err: any) => {
      setError(err?.response?.data?.message || "Failed to delete service.");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleNewCategory = () => {
    const name = form.newCategoryName.trim();
    if (!name) return;
    createCategory.mutate(name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.title || !form.price || !form.categoryId) {
      setError("Title, price, and category are required.");
      return;
    }

    let imageUrl: string | undefined;
    if (imageFile) {
      try {
        const res = await uploadImage.mutateAsync(imageFile);
        imageUrl = res.data.imageUrl;
      } catch {
        setError("Image upload failed. Please try again.");
        return;
      }
    }

    saveService.mutate({
      id: editingId,
      body: {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        duration: form.duration,
        categoryId: form.categoryId,
        ...(imageUrl ? { imageUrl } : {}),
      },
    });
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(empty);
    setImageFile(null);
    setImagePreview(null);
    setError("");
    setCreatingCategory(false);
    setShowForm(true);
  };

  const openEdit = (s: any) => {
    setEditingId(s.id);
    setForm({
      title: s.title || "",
      description: s.description || "",
      price: String(s.price ?? ""),
      duration: s.duration || "",
      categoryId: s.category?.id || "",
      newCategoryName: "",
    });
    setImageFile(null);
    setImagePreview(s.imageUrl ? assetUrl(s.imageUrl) : null);
    setError("");
    setCreatingCategory(false);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(empty);
    setImageFile(null);
    setImagePreview(null);
    setError("");
    setCreatingCategory(false);
  };

  if (isLoading) return <div>Loading...</div>;

  const isBusy = uploadImage.isPending || saveService.isPending;

  return (
    <DashboardShell
      variant="provider"
      title="My Services"
      subtitle="Manage the services you offer. New services go live after admin approval."
      actions={
        <Button variant="hero" onClick={openAdd}>
          <Plus /> Add service
        </Button>
      }
    >
      {/* Add modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md overflow-y-auto max-h-[90vh] rounded-2xl border bg-card p-6 shadow-elevated">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">
                {editingId ? "Edit service" : "Add new service"}
              </h2>
              <button type="button" aria-label="Close" onClick={closeForm} className="rounded-lg p-1 hover:bg-secondary">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {error && (
              <p className="mb-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image upload */}
              <div>
                <span className="mb-1 block text-sm font-medium">Service image</span>
                <div
                  className="relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-input bg-secondary/30 transition-colors hover:bg-secondary/50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 w-full object-cover"
                      />
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
                <label className="mb-1 block text-sm font-medium" htmlFor="ps-title">Title</label>
                <Input
                  id="ps-title"
                  name="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. AC Installation"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="ps-desc">Description</label>
                <textarea
                  id="ps-desc"
                  name="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe what this service includes..."
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium" htmlFor="ps-price">Price ($)</label>
                  <Input
                    id="ps-price"
                    name="price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="e.g. 80"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium" htmlFor="ps-duration">Duration</label>
                  <Input
                    id="ps-duration"
                    name="duration"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="e.g. 2 hours"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="service-category">Category</label>
                <select
                  id="service-category"
                  title="Service category"
                  value={form.categoryId}
                  onChange={(e) => {
                    if (e.target.value === "__new__") {
                      setCreatingCategory(true);
                      setForm({ ...form, categoryId: "" });
                    } else {
                      setCreatingCategory(false);
                      setForm({ ...form, categoryId: e.target.value });
                    }
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required={!creatingCategory}
                >
                  <option value="">Select a category</option>
                  {(categories as any[]).map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                  <option value="__new__">+ Create new category</option>
                </select>
              </div>

              {creatingCategory && (
                <div className="flex gap-2">
                  <Input
                    name="newCategoryName"
                    aria-label="New category name"
                    value={form.newCategoryName}
                    onChange={(e) => setForm({ ...form, newCategoryName: e.target.value })}
                    placeholder="New category name"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleNewCategory}
                    disabled={createCategory.isPending || !form.newCategoryName.trim()}
                  >
                    {createCategory.isPending ? "Creating..." : "Create"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    aria-label="Cancel new category"
                    onClick={() => { setCreatingCategory(false); setForm({ ...form, newCategoryName: "" }); }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {!editingId && (
                <p className="rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
                  Your service will be reviewed by an admin before going live.
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  variant="hero"
                  className="flex-1"
                  disabled={isBusy || (creatingCategory && !form.categoryId)}
                >
                  {uploadImage.isPending
                    ? "Uploading image..."
                    : saveService.isPending
                    ? "Saving..."
                    : editingId
                    ? "Save changes"
                    : "Submit for approval"}
                </Button>
                <Button type="button" variant="outline" onClick={closeForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Services list */}
      {(myServices as any[]).length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
          <p className="text-lg font-medium">No services yet</p>
          <p className="mt-1 text-sm">Click "Add service" to create your first one.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {(myServices as any[]).map((s: any) => (
            <div key={s.id} className="overflow-hidden rounded-2xl border bg-card shadow-soft">
              <div className="h-36 overflow-hidden">
                <img
                  src={s.imageUrl ? assetUrl(s.imageUrl) : getServiceImage(s.title, s.category?.name || "")}
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
                <div className="mt-2">{statusBadge(s.status)}</div>
                <div className="mt-3 flex gap-2 border-t pt-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEdit(s)}
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
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
