import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/data/mock";

const styles: Record<BookingStatus, string> = {
  Pending: "bg-warning/15 text-warning-foreground border-warning/30",
  Accepted: "bg-primary/10 text-primary border-primary/20",
  "In Progress": "bg-accent/15 text-accent border-accent/30",
  Completed: "bg-success/15 text-success border-success/30",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export const StatusBadge = ({ status, className }: { status: BookingStatus; className?: string }) => (
  <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", styles[status], className)}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {status}
  </span>
);
