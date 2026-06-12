import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { api, assetUrl } from "@/lib/api";
import { capitalizeName } from "@/lib/utils";
import { Camera, BadgeCheck, ClipboardList, CheckCircle2, Star } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const ProviderProfile = () => {
  const { user, login, token } = useAuth();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    category: "",
    experience: "",
    serviceArea: "",
    bio: "",
  });
  const [pwForm, setPwForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [pwError, setPwError] = useState("");

  const { data: profile } = useQuery({
    queryKey: ["provider-profile", user?.id],
    queryFn: () => api.get(`/users/${user?.id}`).then((r) => r.data),
    enabled: !!user?.id,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["provider-bookings"],
    queryFn: () => api.get("/bookings").then((r) => r.data),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((r) => r.data),
  });

  const createCategory = useMutation({
    mutationFn: (name: string) => api.post("/categories", { name }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setForm((f) => ({ ...f, category: res.data.name }));
      setNewCategoryName("");
      setCreatingCategory(false);
      toast.success("Category added");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to create category"),
  });

  const handleNewCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    createCategory.mutate(name);
  };

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        phoneNumber: profile.phoneNumber || "",
        email: profile.email || user?.email || "",
        category: profile.category || profile.specialty || "",
        experience: profile.experienceYears?.toString() || profile.experience?.toString() || "",
        serviceArea: profile.serviceArea || profile.area || "",
        bio: profile.bio || profile.skills || "",
      });
      if (profile.avatarUrl) setAvatarPreview(assetUrl(profile.avatarUrl));
    }
  }, [profile]);

  const updateProfile = useMutation({
    mutationFn: (data: object) => api.patch(`/users/${user?.id}`, data),
    onSuccess: (res) => {
      toast.success("Profile updated!");
      if (user && token) {
        login(token, { ...user, name: res.data?.name || form.name });
      }
    },
    onError: () => toast.error("Failed to save profile."),
  });

  const changePassword = useMutation({
    mutationFn: (data: object) => api.post("/auth/change-password", data),
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setPwForm({ current: "", newPass: "", confirm: "" });
      setPwError("");
    },
    onError: () => setPwError("Failed. Check your current password."),
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    const fd = new FormData();
    fd.append("avatar", file);
    api
      .patch(`/users/${user?.id}/avatar`, fd)
      .then((res) => {
        if (res.data?.avatarUrl) setAvatarPreview(assetUrl(res.data.avatarUrl));
        toast.success("Photo updated!");
      })
      .catch(() => toast.error("Photo upload failed."));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    if (pwForm.newPass !== pwForm.confirm)
      return setPwError("Passwords do not match.");
    if (pwForm.newPass.length < 6)
      return setPwError("New password must be at least 6 characters.");
    changePassword.mutate({
      currentPassword: pwForm.current,
      newPassword: pwForm.newPass,
    });
  };

  const displayName = capitalizeName(form.name || user?.name) || "Provider";
  const initials = displayName
    .split(" ")
    .map((x: string) => x[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const total = bookings.length;
  const completed = bookings.filter((b: any) => b.status === "COMPLETED").length;
  const pending = bookings.filter(
    (b: any) => b.status === "PENDING" || b.status === "CONFIRMED",
  ).length;
  const rating =
    profile?.rating != null
      ? Number(profile.rating).toFixed(1)
      : total > 0
        ? (4 + completed / Math.max(total, 1)).toFixed(1)
        : "—";

  return (
    <DashboardShell
      variant="provider"
      title={displayName}
      subtitle="Keep your professional details accurate."
    >
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Sidebar card */}
        <div className="space-y-4">
          <div className="rounded-2xl border bg-card p-6 text-center shadow-soft">
            <div className="relative mx-auto h-28 w-28">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="h-28 w-28 rounded-full object-cover border"
                />
              ) : (
                <div className="grid h-28 w-28 place-items-center rounded-full gradient-hero text-4xl font-bold text-primary-foreground">
                  {initials}
                </div>
              )}
              <button
                type="button"
                title="Change profile photo"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 right-0 grid h-9 w-9 place-items-center rounded-full bg-card border shadow-soft hover:bg-secondary"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                aria-label="Upload profile photo"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="mt-4 font-display text-lg font-semibold">
              {displayName}
            </div>
            <div className="flex items-center justify-center gap-1 text-sm text-primary">
              <BadgeCheck className="h-4 w-4" /> Verified Pro
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border bg-card p-3 text-center shadow-soft">
              <ClipboardList className="mx-auto h-5 w-5 text-primary" />
              <div className="mt-1 font-display text-xl font-bold">{total}</div>
              <div className="text-xs text-muted-foreground">Total jobs</div>
            </div>
            <div className="rounded-2xl border bg-card p-3 text-center shadow-soft">
              <CheckCircle2 className="mx-auto h-5 w-5 text-success" />
              <div className="mt-1 font-display text-xl font-bold">{completed}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="rounded-2xl border bg-card p-3 text-center shadow-soft">
              <Star className="mx-auto h-5 w-5 text-warning" />
              <div className="mt-1 font-display text-xl font-bold">{rating}</div>
              <div className="text-xs text-muted-foreground">Rating</div>
            </div>
          </div>

          {pending > 0 && (
            <div className="rounded-2xl border bg-warning/10 p-4 text-center shadow-soft">
              <div className="font-display text-2xl font-bold text-warning">{pending}</div>
              <div className="text-sm text-muted-foreground">Active jobs pending</div>
            </div>
          )}
        </div>

        {/* Forms */}
        <div className="space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (form.phoneNumber && !/^\d{11}$/.test(form.phoneNumber)) {
                toast.error("Phone number must be exactly 11 digits.");
                return;
              }
              updateProfile.mutate({
                name: form.name,
                phoneNumber: form.phoneNumber,
                email: form.email,
                category: form.category,
                experienceYears: form.experience ? Number(form.experience) : undefined,
                serviceArea: form.serviceArea,
                bio: form.bio,
              });
            }}
            className="rounded-2xl border bg-card p-6 shadow-soft space-y-4"
          >
            <h2 className="font-display font-semibold text-lg">
              Professional details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Full name"
                value={form.name}
                onChange={(v: string) => setForm({ ...form, name: v })}
              />
              <Field
                label="Phone"
                value={form.phoneNumber}
                inputMode="numeric"
                maxLength={11}
                placeholder="03001234567"
                onChange={(v: string) =>
                  setForm({ ...form, phoneNumber: v.replace(/\D/g, "").slice(0, 11) })
                }
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v: string) => setForm({ ...form, email: v })}
              />
              <div>
                <Label htmlFor="provider-category">Service category</Label>
                <select
                  id="provider-category"
                  title="Service category"
                  value={form.category}
                  onChange={(e) => {
                    if (e.target.value === "__new__") {
                      setCreatingCategory(true);
                      setForm({ ...form, category: "" });
                    } else {
                      setCreatingCategory(false);
                      setForm({ ...form, category: e.target.value });
                    }
                  }}
                  className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select a category</option>
                  {(categories as any[]).map((c: any) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                  <option value="__new__">+ Create new category</option>
                </select>
                {creatingCategory && (
                  <div className="mt-2 flex gap-2">
                    <Input
                      name="newCategoryName"
                      aria-label="New category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="New category name"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleNewCategory}
                      disabled={createCategory.isPending || !newCategoryName.trim()}
                    >
                      {createCategory.isPending ? "Adding..." : "Add"}
                    </Button>
                  </div>
                )}
              </div>
              <Field
                label="Experience (years)"
                type="number"
                value={form.experience}
                onChange={(v: string) => setForm({ ...form, experience: v })}
                placeholder="e.g. 5"
              />
              <Field
                label="Service area"
                value={form.serviceArea}
                onChange={(v: string) => setForm({ ...form, serviceArea: v })}
                placeholder="e.g. Karachi, Lahore"
              />
            </div>
            <div>
              <Label htmlFor="provider-bio">Skills / Bio</Label>
              <Textarea
                id="provider-bio"
                name="bio"
                className="mt-1.5"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Describe your skills and experience..."
                rows={3}
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="hero"
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>

          <form
            onSubmit={handlePasswordSubmit}
            className="rounded-2xl border bg-card p-6 shadow-soft space-y-4"
          >
            <h2 className="font-display font-semibold text-lg">
              Change password
            </h2>
            {pwError && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {pwError}
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-3">
              <Field
                label="Current password"
                type="password"
                value={pwForm.current}
                onChange={(v: string) => setPwForm({ ...pwForm, current: v })}
                placeholder="••••••••"
              />
              <Field
                label="New password"
                type="password"
                value={pwForm.newPass}
                onChange={(v: string) => setPwForm({ ...pwForm, newPass: v })}
                placeholder="••••••••"
              />
              <Field
                label="Confirm new password"
                type="password"
                value={pwForm.confirm}
                onChange={(v: string) => setPwForm({ ...pwForm, confirm: v })}
                placeholder="••••••••"
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="hero"
                disabled={changePassword.isPending}
              >
                {changePassword.isPending ? "Changing..." : "Change password"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardShell>
  );
};

const Field = ({
  label,
  value,
  onChange,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  [k: string]: any;
}) => {
  const fieldId = `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div>
      <Label htmlFor={fieldId}>{label}</Label>
      <Input
        id={fieldId}
        name={fieldId}
        className="mt-1.5"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
    </div>
  );
};

export default ProviderProfile;
