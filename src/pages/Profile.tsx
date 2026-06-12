import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { api, assetUrl } from "@/lib/api";
import { capitalizeName } from "@/lib/utils";
import { Camera } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Profile = () => {
  const { user, login, token } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    city: "",
    address: "",
  });
  const [pwForm, setPwForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [pwError, setPwError] = useState("");

  const { data: profile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: () => api.get(`/users/${user?.id}`).then((r) => r.data),
    enabled: !!user?.id,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => api.get("/bookings").then((r) => r.data),
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        phoneNumber: profile.phoneNumber || "",
        email: profile.email || user?.email || "",
        city: profile.city || "",
        address: profile.address || "",
      });
      if (profile.avatarUrl) setAvatarPreview(assetUrl(profile.avatarUrl));
    }
  }, [profile, user]);

  const updateProfile = useMutation({
    mutationFn: (data: object) => api.patch(`/users/${user?.id}`, data),
    onSuccess: (res) => {
      toast.success("Profile saved!");
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

  const displayName = capitalizeName(form.name || user?.name) || "User";
  const initials = displayName
    .split(" ")
    .map((x: string) => x[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const memberYear = profile?.createdAt
    ? new Date(profile.createdAt).getFullYear()
    : new Date().getFullYear();
  const completed = bookings.filter(
    (b: { status: string }) => b.status === "COMPLETED",
  ).length;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container py-10">
        <h1 className="font-display text-3xl font-bold">{displayName}</h1>
        <p className="text-muted-foreground">
          Keep your details up to date for the best experience.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Avatar card */}
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
            <div className="text-sm text-muted-foreground">
              Member since {memberYear}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-secondary p-3">
                <div className="font-display text-xl font-bold">
                  {bookings.length}
                </div>
                <div className="text-xs text-muted-foreground">Bookings</div>
              </div>
              <div className="rounded-lg bg-secondary p-3">
                <div className="font-display text-xl font-bold">{completed}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Personal details form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (form.phoneNumber && !/^\d{11}$/.test(form.phoneNumber)) {
                  toast.error("Phone number must be exactly 11 digits.");
                  return;
                }
                updateProfile.mutate(form);
              }}
              className="rounded-2xl border bg-card p-6 shadow-soft space-y-4"
            >
              <h2 className="font-display font-semibold text-lg">
                Personal details
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
                <Field
                  label="City"
                  value={form.city}
                  onChange={(v: string) => setForm({ ...form, city: v })}
                />
              </div>
              <Field
                label="Address"
                value={form.address}
                onChange={(v: string) => setForm({ ...form, address: v })}
              />
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

            {/* Password form */}
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
                  onChange={(v: string) =>
                    setPwForm({ ...pwForm, current: v })
                  }
                  placeholder="••••••••"
                />
                <Field
                  label="New password"
                  type="password"
                  value={pwForm.newPass}
                  onChange={(v: string) =>
                    setPwForm({ ...pwForm, newPass: v })
                  }
                  placeholder="••••••••"
                />
                <Field
                  label="Confirm new password"
                  type="password"
                  value={pwForm.confirm}
                  onChange={(v: string) =>
                    setPwForm({ ...pwForm, confirm: v })
                  }
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
      </div>
      <SiteFooter />
    </div>
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
} & Record<string, unknown>) => {
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

export default Profile;
