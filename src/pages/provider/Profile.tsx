import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BadgeCheck, Camera } from "lucide-react";
import { toast } from "sonner";

const ProviderProfile = () => (
  <DashboardShell variant="provider" title="My profile" subtitle="Keep your professional details accurate.">
    <form onSubmit={(e) => { e.preventDefault(); toast.success("Profile updated"); }} className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <div className="rounded-2xl border bg-card p-6 text-center shadow-soft">
        <div className="relative mx-auto h-28 w-28">
          <div className="grid h-28 w-28 place-items-center rounded-full gradient-hero text-4xl text-primary-foreground">AK</div>
          <button type="button" className="absolute -bottom-1 right-0 grid h-9 w-9 place-items-center rounded-full bg-card border shadow-soft"><Camera className="h-4 w-4" /></button>
        </div>
        <div className="mt-4 font-display text-lg font-semibold">Ahmed Khan</div>
        <div className="flex items-center justify-center gap-1 text-sm text-primary"><BadgeCheck className="h-4 w-4" /> Verified Pro</div>
        <div className="mt-4 rounded-xl bg-secondary p-3 text-sm">
          <div className="font-bold">⭐ 4.9</div>
          <div className="text-xs text-muted-foreground">412 jobs · 8 yrs experience</div>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-soft space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" defaultValue="Ahmed Khan" />
          <Field label="Phone" defaultValue="+1 555 0123" />
          <Field label="Email" type="email" defaultValue="ahmed@homehero.app" />
          <Field label="Service category" defaultValue="Electrician" />
          <Field label="Experience (years)" type="number" defaultValue="8" />
          <Field label="Service area" defaultValue="Downtown, Westside" />
          <Field label="CNIC" defaultValue="**** **** 4521" />
          <div><Label>Verification status</Label><div className="mt-1.5 rounded-md border bg-success/10 px-3 py-2 text-sm font-medium text-success">✓ Verified</div></div>
        </div>
        <div><Label>Skills</Label><Textarea className="mt-1.5" defaultValue="Wiring, switchboard installation, fault diagnosis, lighting, MCB & DB boards" /></div>
        <div className="flex justify-end gap-2"><Button variant="ghost" type="button">Cancel</Button><Button variant="hero">Save</Button></div>
      </div>
    </form>
  </DashboardShell>
);

const Field = ({ label, ...rest }: any) => (<div><Label>{label}</Label><Input className="mt-1.5" {...rest} /></div>);

export default ProviderProfile;
