import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Calendar,
  MapPin,
  CreditCard,
  FileText,
  Phone,
  BadgeCheck,
  Star,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const steps: { key: string; label: string }[] = [
  { key: "PENDING", label: "Booked" },
  { key: "ACCEPTED", label: "Accepted" },
  { key: "IN_PROGRESS", label: "In progress" },
  { key: "COMPLETED", label: "Completed" },
];

const BookingDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [showReview, setShowReview] = useState(false);
  const [starHover, setStarHover] = useState(0);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const { data: b, isLoading } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => api.get(`/bookings/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  const submitReview = useMutation({
    mutationFn: () =>
      api.patch(`/bookings/${id}/review`, { rating, reviewText }),
    onSuccess: () => {
      toast.success("Review submitted! Thank you.");
      setShowReview(false);
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
    },
    onError: () => toast.error("Failed to submit review."),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!b) return <div>Booking not found</div>;

  const activeIdx = steps.findIndex((s) => s.key === b.status.toUpperCase());
  const isCompleted = b.status.toUpperCase() === "COMPLETED";
  const alreadyReviewed = !!b.rating;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container py-10">
        <Link
          to="/bookings"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          ← Back to bookings
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Booking #{b.id}</div>
            <h1 className="font-display text-3xl font-bold">
              {b.service?.title}
            </h1>
          </div>
          <StatusBadge status={b.status} />
        </div>

        {/* Progress tracker */}
        <div className="mt-8 rounded-2xl border bg-card p-6 shadow-soft">
          <div className="grid grid-cols-4 gap-2">
            {steps.map((s, i) => (
              <div key={s.key} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full text-xs font-bold",
                    i <= activeIdx
                      ? "gradient-hero text-primary-foreground shadow-glow"
                      : "bg-secondary text-muted-foreground",
                  )}
                >
                  {i + 1}
                </div>
                <div
                  className={cn(
                    "text-xs",
                    i <= activeIdx ? "font-semibold" : "text-muted-foreground",
                  )}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          <div className="relative mt-3 h-1.5 rounded-full bg-secondary">
            <div
              className="h-full rounded-full gradient-hero transition-all"
              style={{ width: `${(activeIdx / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <Section title="Service details">
              <Row
                icon={Calendar}
                label="Date & time"
                value={`${b.date} · ${b.time || "TBD"}`}
              />
              <Row icon={MapPin} label="Address" value={b.address || "—"} />
              <Row
                icon={CreditCard}
                label="Payment"
                value={`$${b.totalAmount} · Card`}
              />
              <Row
                icon={FileText}
                label="Notes"
                value={b.specialInstructions || "—"}
              />
            </Section>

            <Section title="Provider">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-full gradient-soft text-2xl">
                  👨🏽‍🔧
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-semibold">
                    {b.provider?.name || "Assigning..."}{" "}
                    <BadgeCheck className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Verified Professional
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4" /> Call
                </Button>
              </div>
            </Section>

            {/* Show existing review */}
            {alreadyReviewed && (
              <Section title="Your review">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        "h-5 w-5",
                        s <= b.rating
                          ? "fill-warning text-warning"
                          : "text-muted-foreground",
                      )}
                    />
                  ))}
                  <span className="ml-2 text-sm font-semibold">{b.rating}/5</span>
                </div>
                {b.reviewText && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {b.reviewText}
                  </p>
                )}
              </Section>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border bg-card p-6 shadow-elevated">
              <div className="font-display font-semibold">Need changes?</div>
              <div className="mt-3 space-y-2">
                {(b.status.toUpperCase() === "PENDING" ||
                  b.status.toUpperCase() === "ACCEPTED") && (
                  <Button variant="outline" className="w-full text-destructive">
                    Cancel booking
                  </Button>
                )}
                {isCompleted && !alreadyReviewed && (
                  <Button
                    variant="accent"
                    className="w-full"
                    onClick={() => setShowReview(true)}
                  >
                    <Star className="h-4 w-4" /> Leave a review
                  </Button>
                )}
                {isCompleted && alreadyReviewed && (
                  <div className="flex items-center justify-center gap-1 rounded-lg bg-secondary py-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    Review submitted
                  </div>
                )}
                <Button variant="ghost" className="w-full">
                  Contact support
                </Button>
              </div>
            </div>

            {/* Rating modal panel */}
            {showReview && (
              <div className="rounded-2xl border bg-card p-6 shadow-elevated space-y-4">
                <div className="font-display font-semibold">Rate this service</div>

                {/* Star picker */}
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseEnter={() => setStarHover(s)}
                      onMouseLeave={() => setStarHover(0)}
                      onClick={() => setRating(s)}
                      className="focus:outline-none"
                      aria-label={`Rate ${s} star`}
                    >
                      <Star
                        className={cn(
                          "h-8 w-8 transition-colors",
                          s <= (starHover || rating)
                            ? "fill-warning text-warning"
                            : "text-muted-foreground",
                        )}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-center text-sm font-medium text-muted-foreground">
                    {["", "Poor", "Fair", "Good", "Great", "Excellent!"][rating]}
                  </p>
                )}

                <Textarea
                  id="review-text"
                  name="reviewText"
                  aria-label="Review text"
                  placeholder="Tell us about your experience (optional)"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={3}
                />

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowReview(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="hero"
                    className="flex-1"
                    disabled={rating === 0 || submitReview.isPending}
                    onClick={() => submitReview.mutate()}
                  >
                    {submitReview.isPending ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl border bg-card p-6 shadow-soft">
    <div className="mb-3 font-display font-semibold">{title}</div>
    <div className="space-y-3">{children}</div>
  </div>
);

const Row = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 text-sm">
    <Icon className="mt-0.5 h-4 w-4 text-primary" />
    <div className="flex-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  </div>
);

export default BookingDetail;