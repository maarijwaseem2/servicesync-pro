import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Star, EyeOff, Eye } from "lucide-react";

import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";

const AdminReviews = () => {
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: () => api.get("/reviews/admin").then((res) => res.data),
  });

  const toggleVisibility = useMutation({
    mutationFn: ({ id, hidden }: { id: string; hidden: boolean }) =>
      api.patch(`/bookings/${id}/review/visibility`, { hidden }),
    onSuccess: (_res, vars) => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success(vars.hidden ? "Review hidden" : "Review is now visible");
    },
    onError: () => toast.error("Failed to update review"),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <DashboardShell
      variant="admin"
      title="Reviews"
      subtitle="Moderate customer reviews of providers."
    >
      {(reviews as any[]).length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
          <p className="text-lg font-medium">No reviews yet</p>
          <p className="mt-1 text-sm">
            Customer reviews appear here after they rate a completed booking.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {(reviews as any[]).map((r: any) => (
            <div
              key={r.id}
              className={`rounded-2xl border bg-card p-5 shadow-soft ${r.reviewHidden ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display font-semibold capitalize">
                    {r.customer?.name || "Customer"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    on {r.service?.title || "a service"}
                    {r.provider?.name ? ` · with ${r.provider.name}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-warning">
                  {[...Array(r.rating || 0)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              {r.reviewText && (
                <p className="mt-3 text-sm text-muted-foreground">"{r.reviewText}"</p>
              )}
              {r.reviewHidden && (
                <span className="mt-2 inline-block rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                  Hidden from public
                </span>
              )}
              <div className="mt-4 flex items-center justify-between border-t pt-3">
                <span className="text-xs text-muted-foreground">
                  {r.bookingDate || new Date(r.date).toLocaleDateString()}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={toggleVisibility.isPending}
                  onClick={() =>
                    toggleVisibility.mutate({ id: r.id, hidden: !r.reviewHidden })
                  }
                >
                  {r.reviewHidden ? (
                    <>
                      <Eye className="h-3.5 w-3.5" /> Unhide
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3.5 w-3.5" /> Hide
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
};

export default AdminReviews;
