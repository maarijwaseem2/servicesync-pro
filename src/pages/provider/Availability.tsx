import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { DashboardShell } from "@/components/DashboardShell";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type AvailabilityState = {
  acceptingJobs: boolean;
  days: Record<string, boolean>;
  startTime: string;
  endTime: string;
  breakStart: string;
  breakEnd: string;
};

const defaultAvailability: AvailabilityState = {
  acceptingJobs: true,
  days: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false },
  startTime: "09:00",
  endTime: "18:00",
  breakStart: "13:00",
  breakEnd: "14:00",
};

const ProviderAvailability = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<AvailabilityState>(defaultAvailability);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["users", user?.id],
    queryFn: () => api.get(`/users/${user!.id}`).then((res) => res.data),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (profile?.availability) {
      setForm({ ...defaultAvailability, ...profile.availability });
    }
  }, [profile]);

  const save = useMutation({
    mutationFn: (availability: AvailabilityState) =>
      api.patch(`/users/${user!.id}`, { availability }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", user?.id] });
      toast.success("Availability saved");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to save availability"),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <DashboardShell variant="provider" title="Availability" subtitle="Control when you can take new jobs.">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-soft lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
            <div>
              <div className="font-semibold">Accepting new jobs</div>
              <div className="text-sm text-muted-foreground">Toggle off when on leave or unavailable.</div>
            </div>
            <Switch
              checked={form.acceptingJobs}
              onCheckedChange={(v) => setForm({ ...form, acceptingJobs: v })}
            />
          </div>

          <div>
            <div className="mb-3 font-display font-semibold">Working days</div>
            <div className="flex flex-wrap gap-2">
              {days.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() =>
                    setForm({ ...form, days: { ...form.days, [d]: !form.days[d] } })
                  }
                  className={cn(
                    "rounded-xl border px-4 py-2 text-sm font-medium",
                    form.days[d] ? "border-primary bg-primary/10 text-primary" : "",
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="avail-start">Start time</Label>
              <Input
                id="avail-start"
                name="startTime"
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="avail-end">End time</Label>
              <Input
                id="avail-end"
                name="endTime"
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="avail-break-start">Break start</Label>
              <Input
                id="avail-break-start"
                name="breakStart"
                type="time"
                value={form.breakStart}
                onChange={(e) => setForm({ ...form, breakStart: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="avail-break-end">Break end</Label>
              <Input
                id="avail-break-end"
                name="breakEnd"
                type="time"
                value={form.breakEnd}
                onChange={(e) => setForm({ ...form, breakEnd: e.target.value })}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="hero" disabled={save.isPending} onClick={() => save.mutate(form)}>
              {save.isPending ? "Saving..." : "Save changes"}
            </Button>
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
