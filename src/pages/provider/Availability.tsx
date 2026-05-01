import { useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const ProviderAvailability = () => {
  const [active, setActive] = useState(true);
  const [working, setWorking] = useState<Record<string, boolean>>({ Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false });

  return (
    <DashboardShell variant="provider" title="Availability" subtitle="Control when you can take new jobs.">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-soft lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
            <div>
              <div className="font-semibold">Accepting new jobs</div>
              <div className="text-sm text-muted-foreground">Toggle off when on leave or unavailable.</div>
            </div>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>

          <div>
            <div className="mb-3 font-display font-semibold">Working days</div>
            <div className="flex flex-wrap gap-2">
              {days.map(d => (
                <button key={d} onClick={() => setWorking(w => ({...w, [d]: !w[d]}))} className={cn("rounded-xl border px-4 py-2 text-sm font-medium", working[d] ? "border-primary bg-primary/10 text-primary" : "")}>{d}</button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Start time</Label><Input type="time" defaultValue="09:00" className="mt-1.5" /></div>
            <div><Label>End time</Label><Input type="time" defaultValue="18:00" className="mt-1.5" /></div>
            <div><Label>Break start</Label><Input type="time" defaultValue="13:00" className="mt-1.5" /></div>
            <div><Label>Break end</Label><Input type="time" defaultValue="14:00" className="mt-1.5" /></div>
          </div>

          <div className="flex justify-end">
            <Button variant="hero" onClick={() => toast.success("Availability saved")}>Save changes</Button>
          </div>
        </div>

        <div className="rounded-2xl gradient-soft p-6">
          <div className="font-display font-semibold">Tips</div>
          <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
            <li>• Update availability the night before for best matching.</li>
            <li>• Add break times to avoid overlapping jobs.</li>
            <li>• Mark off-days at least 24h in advance.</li>
          </ul>
        </div>
      </div>
    </DashboardShell>
  );
};

export default ProviderAvailability;
