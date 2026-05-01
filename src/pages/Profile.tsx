import { Camera } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Profile = () => (
  <div className="min-h-screen">
    <SiteHeader />
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold">My profile</h1>
      <p className="text-muted-foreground">Keep your details up to date for the best experience.</p>

      <form onSubmit={(e) => { e.preventDefault(); toast.success("Profile saved"); }} className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border bg-card p-6 text-center shadow-soft">
          <div className="relative mx-auto h-28 w-28">
            <div className="grid h-28 w-28 place-items-center rounded-full gradient-hero text-4xl text-primary-foreground">JC</div>
            <button type="button" className="absolute -bottom-1 right-0 grid h-9 w-9 place-items-center rounded-full bg-card border shadow-soft hover:bg-secondary"><Camera className="h-4 w-4" /></button>
          </div>
          <div className="mt-4 font-display text-lg font-semibold">Jane Cooper</div>
          <div className="text-sm text-muted-foreground">Member since 2024</div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg bg-secondary p-3"><div className="font-display text-xl font-bold">12</div><div className="text-xs text-muted-foreground">Bookings</div></div>
            <div className="rounded-lg bg-secondary p-3"><div className="font-display text-xl font-bold">4.9</div><div className="text-xs text-muted-foreground">Avg rating</div></div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-soft space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" defaultValue="Jane Cooper" />
            <Field label="Phone" defaultValue="+1 555 0101" />
            <Field label="Email" type="email" defaultValue="jane@email.com" />
            <Field label="City" defaultValue="Downtown" />
          </div>
          <Field label="Address" defaultValue="12 Garden Lane, Apt 4B" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="New password" type="password" placeholder="••••••••" />
            <Field label="Confirm password" type="password" placeholder="••••••••" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost">Cancel</Button>
            <Button type="submit" variant="hero">Save changes</Button>
          </div>
        </div>
      </form>
    </div>
    <SiteFooter />
  </div>
);

const Field = ({ label, ...rest }: any) => (
  <div><Label>{label}</Label><Input className="mt-1.5" {...rest} /></div>
);

export default Profile;
