import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Star, EyeOff } from "lucide-react";
import { reviews } from "@/data/mock";

const AdminReviews = () => (
  <DashboardShell variant="admin" title="Reviews" subtitle="Moderate customer reviews of providers.">
    <div className="grid gap-4 lg:grid-cols-2">
      {[...reviews, ...reviews].map((r, i) => (
        <div key={i} className="rounded-2xl border bg-card p-5 shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-display font-semibold">{r.customer}</div>
              <div className="text-xs text-muted-foreground">on {r.service} · with {r.provider}</div>
            </div>
            <div className="flex items-center gap-1 text-warning">{[...Array(r.rating)].map((_,j) => <Star key={j} className="h-4 w-4 fill-current" />)}</div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">"{r.text}"</p>
          <div className="mt-4 flex items-center justify-between border-t pt-3">
            <span className="text-xs text-muted-foreground">{r.date}</span>
            <Button size="sm" variant="outline"><EyeOff className="h-3.5 w-3.5" /> Hide</Button>
          </div>
        </div>
      ))}
    </div>
  </DashboardShell>
);

export default AdminReviews;
