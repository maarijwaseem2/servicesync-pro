import { useQuery } from "@tanstack/react-query";
import { api, assetUrl } from "@/lib/api";
import { toast } from "sonner";

import { Link, useParams } from "react-router-dom";
import {
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  BadgeCheck,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";

const ServiceDetail = () => {
  const { id } = useParams();

  const { data: service, isLoading } = useQuery({
    queryKey: ["services", id],
    queryFn: async () => {
      const res = await api.get(`/services/${id}`);
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="container py-20 text-center">Loading details...</div>
    );
  if (!service)
    return (
      <div className="container py-20 text-center">Service not found.</div>
    );

  const matched = service.provider ? [service.provider] : [];
  const reviewsList = []; // Backend doesn't have reviews yet

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container py-10">
        <Link
          to="/services"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          ← Back to services
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl shadow-soft">
              <img
                src={service.imageUrl ? assetUrl(service.imageUrl) : "/assets/deep-cleaning.jfif"}
                alt={service.title}
                className="h-full w-full object-cover"
              />
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold">
              {service.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-warning">
                <Star className="h-4 w-4 fill-current" />{" "}
                <span className="font-semibold text-foreground">4.9</span>{" "}
                <span className="text-muted-foreground">(150 reviews)</span>
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" /> 1-2 hrs
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Shield className="h-4 w-4" /> Insured & guaranteed
              </span>
            </div>
            <p className="mt-5 max-w-2xl text-muted-foreground">
              {service.description ||
                "Professional service delivered at your doorstep."}
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border bg-card p-6">
                <div className="font-display text-lg font-bold">
                  What's included
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  {[
                    "Inspection & diagnostics",
                    "Tools and minor parts",
                    "Cleanup after the job",
                    "30-day workmanship warranty",
                  ].map((i) => (
                    <li key={i} className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />{" "}
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border bg-card p-6">
                <div className="font-display text-lg font-bold">
                  Not included
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  {[
                    "Major spare parts",
                    "Structural changes",
                    "Material costs over $25",
                  ].map((i) => (
                    <li key={i} className="flex gap-2">
                      <XCircle className="h-4 w-4 shrink-0 text-destructive" />{" "}
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="font-display text-2xl font-bold">
                Available pros
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {matched.map((p: any) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-4 rounded-2xl border bg-card p-4"
                  >
                    <div className="grid h-14 w-14 place-items-center rounded-full gradient-soft text-2xl">
                      {p.name?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-display font-semibold">
                        {p.name} <BadgeCheck className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Verified Pro · Pakistan
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-warning">
                        <Star className="h-3 w-3 fill-current" /> 4.9 · 120 jobs
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="font-display text-2xl font-bold">
                Customer reviews
              </h2>
              <div className="mt-4 space-y-4">
                {reviewsList.length > 0 ? (
                  reviewsList.map((r: any) => (
                    <div key={r.id} className="rounded-2xl border bg-card p-5">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{r.customer}</div>
                        <div className="flex items-center gap-1 text-warning text-xs">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        "{r.text}"
                      </p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {r.date}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No reviews yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Booking side card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border bg-card p-6 shadow-elevated">
              <div className="text-sm text-muted-foreground">Starting at</div>
              <div className="font-display text-4xl font-bold">
                ${service.price}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Final price after inspection.
              </div>
              <Button asChild variant="hero" size="lg" className="mt-5 w-full">
                <Link to={`/book/${service.id}`}>Book service</Link>
              </Button>
              <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 text-primary" /> 100%
                  money-back guarantee
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-primary" /> Same-day
                  available
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-3.5 w-3.5 text-primary" /> Verified
                  professionals
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default ServiceDetail;
