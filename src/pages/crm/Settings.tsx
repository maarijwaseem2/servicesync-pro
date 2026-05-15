import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

const leadSources = ["Website", "Referral", "Ads", "Social"];

const CRMSettings = () => (
  <DashboardShell
    variant="crm"
    title="Settings"
    subtitle="Configure your CRM workspace."
  >
    <form
      onSubmit={(e) => {
        e.preventDefault();
        toast.success("Settings saved");
      }}
      className="grid gap-6 lg:grid-cols-2"
    >
      <Section title="Workspace">
        <Field label="Company name" defaultValue="Acme Sales" />
        <Field label="Default currency" defaultValue="USD" />
      </Section>
      <Section title="Lead sources">
        <div className="flex flex-wrap gap-2">
          {leadSources.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-2 rounded-full border bg-secondary px-3 py-1 text-sm"
            >
              {s} <X className="h-3 w-3 cursor-pointer text-muted-foreground" />
            </span>
          ))}
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-dashed px-3 py-1 text-sm text-muted-foreground hover:bg-secondary"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>
      </Section>
      <Section title="Pipeline stages">
        <div className="space-y-2">
          {["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"].map(
            (s) => (
              <div
                key={s}
                className="flex items-center justify-between rounded-lg border p-3 text-sm"
              >
                <span>{s}</span>
                <Switch defaultChecked />
              </div>
            ),
          )}
        </div>
      </Section>
      <Section title="Notifications">
        <Toggle label="New lead assigned" defaultChecked />
        <Toggle label="Follow-up reminders" defaultChecked />
        <Toggle label="Daily summary email" />
      </Section>
      <div className="lg:col-span-2 flex justify-end">
        <Button variant="hero">Save settings</Button>
      </div>
    </form>
  </DashboardShell>
);

const Section = ({ title, children }: any) => (
  <div className="rounded-2xl border bg-card p-6 shadow-soft space-y-4">
    <div className="font-display text-lg font-semibold">{title}</div>
    {children}
  </div>
);
const Field = ({ label, ...rest }: any) => (
  <div>
    <Label>{label}</Label>
    <Input className="mt-1.5" {...rest} />
  </div>
);
const Toggle = ({ label, ...rest }: any) => (
  <div className="flex items-center justify-between rounded-lg border p-3">
    <span className="text-sm font-medium">{label}</span>
    <Switch {...rest} />
  </div>
);

export default CRMSettings;
