export const CRM_STAGES = ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"] as const;
export const CRM_SOURCES = ["Website", "Referral", "Ads", "Social"] as const;

export const STAGE_COLORS: Record<string, string> = {
  New: "bg-sky-500/15 text-sky-600",
  Contacted: "bg-violet-500/15 text-violet-600",
  Qualified: "bg-primary/10 text-primary",
  Proposal: "bg-warning/15 text-warning",
  Won: "bg-success/15 text-success",
  Lost: "bg-destructive/10 text-destructive",
};

export type LeadStage = (typeof CRM_STAGES)[number];

export function statusToStage(status: string): LeadStage {
  const map: Record<string, LeadStage> = {
    PENDING: "New",
    CONFIRMED: "Contacted",
    IN_PROGRESS: "Qualified",
    COMPLETED: "Won",
    CANCELLED: "Lost",
  };
  return map[status] ?? "New";
}

export function bookingSource(id: string): string {
  const last = id?.slice(-1) || "0";
  return CRM_SOURCES[parseInt(last, 16) % CRM_SOURCES.length];
}
