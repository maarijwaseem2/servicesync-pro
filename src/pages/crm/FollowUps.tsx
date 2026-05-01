import { DashboardShell } from "@/components/DashboardShell";
import { leads } from "@/data/mock";
import { Phone, Mail, MessageSquare, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const FollowUps = () => {
  const list = leads.filter(l => l.nextFollowUp !== "—");
  return (
    <DashboardShell variant="crm" title="Follow-ups" subtitle="Stay on top of every conversation.">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {list.map(l => (
            <div key={l.id} className="rounded-2xl border bg-card p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-display text-lg font-semibold">{l.name}</div>
                  <div className="text-sm text-muted-foreground">{l.contact} · {l.email}</div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"><Calendar className="h-3 w-3" /> {l.nextFollowUp}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="hero"><Phone className="h-4 w-4" /> Call</Button>
                <Button size="sm" variant="outline"><Mail className="h-4 w-4" /> Email</Button>
                <Button size="sm" variant="ghost"><MessageSquare className="h-4 w-4" /> Note</Button>
                <Button size="sm" variant="ghost">Reschedule</Button>
              </div>
            </div>
          ))}
        </div>
        <aside>
          <div className="rounded-2xl border bg-card p-6 shadow-soft">
            <div className="font-display font-semibold">This week</div>
            <div className="mt-3 space-y-2 text-sm">
              {["Mon","Tue","Wed","Thu","Fri"].map((d,i) => (
                <div key={d} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="font-medium">{d}</span>
                  <span className="text-muted-foreground">{[3,5,4,2,6][i]} tasks</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
};

export default FollowUps;
