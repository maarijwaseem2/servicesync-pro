import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const AdminSettings = () => (
  <DashboardShell variant="admin" title="Settings" subtitle="Platform configuration.">
    <form onSubmit={(e) => { e.preventDefault(); toast.success("Settings saved"); }} className="grid gap-6 lg:grid-cols-2">
      <Section title="Branding">
        <Field label="Platform name" defaultValue="HomeHero" />
        <div><Label>Logo</Label><Input type="file" className="mt-1.5" /></div>
      </Section>
      <Section title="Service cities">
        <Textarea defaultValue="Downtown, Westside, Northside, Eastside" />
      </Section>
      <Section title="Cancellation rules">
        <Field label="Free cancellation window (hours)" type="number" defaultValue="2" />
        <Field label="Cancellation fee (%)" type="number" defaultValue="15" />
      </Section>
      <Section title="Payment methods">
        <Toggle label="Cash on service" defaultChecked />
        <Toggle label="Credit / Debit card" defaultChecked />
        <Toggle label="Digital wallets" defaultChecked />
      </Section>
      <Section title="Notifications">
        <Toggle label="Email notifications" defaultChecked />
        <Toggle label="SMS notifications" defaultChecked />
        <Toggle label="Push notifications" />
      </Section>
      <div className="lg:col-span-2 flex justify-end"><Button variant="hero">Save settings</Button></div>
    </form>
  </DashboardShell>
);

const Section = ({ title, children }: any) => (
  <div className="rounded-2xl border bg-card p-6 shadow-soft space-y-4">
    <div className="font-display text-lg font-semibold">{title}</div>
    {children}
  </div>
);
const Field = ({ label, ...rest }: any) => (<div><Label>{label}</Label><Input className="mt-1.5" {...rest} /></div>);
const Toggle = ({ label, ...rest }: any) => (
  <div className="flex items-center justify-between rounded-lg border p-3">
    <span className="text-sm font-medium">{label}</span>
    <Switch {...rest} />
  </div>
);

export default AdminSettings;
