import { Link, useParams } from "react-router-dom";
import { Star, CheckCircle2, XCircle, Clock, Shield, BadgeCheck } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { services, providers, reviews } from "@/data/mock";

const ServiceDetail = () => {
  const { id } = useParams();
  const service = services.find(s => s.id === id) || services[0];
  const matched = providers.filter(p => p.category === service.category);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container py-10">
        <Link to="/services" className="text-sm text-muted-foreground hover:text-primary">← Back to services</Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="grid h-72 place-items-center rounded-3xl gradient-soft text-9xl shadow-soft">{service.img}</div>
            <h1 className="mt-6 font-display text-4xl font-bold">{service.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-warning"><Star className="h-4 w-4 fill-current" /> <span className="font-semibold text-foreground">{service.rating}</span> <span className="text-muted-foreground">({service.reviews} reviews)</span></span>
              <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-4 w-4" /> {service.duration}</span>
              <span className="flex items-center gap-1 text-muted-foreground"><Shield className="h-4 w-4" /> Insured & guaranteed</span>
            </div>
            <p className="mt-5 max-w-2xl text-muted-foreground">{service.desc}</p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border bg-card p-6">
                <div className="font-display text-lg font-bold">What's included</div>
                <ul className="mt-3 space-y-2 text-sm">
                  {["Inspection & diagnostics", "Tools and minor parts", "Cleanup after the job", "30-day workmanship warranty"].map(i => (
                    <li key={i} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-success" /> {i}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border bg-card p-6">
                <div className="font-display text-lg font-bold">Not included</div>
                <ul className="mt-3 space-y-2 text-sm">
                  {["Major spare parts", "Structural changes", "Material costs over $25"].map(i => (
                    <li key={i} className="flex gap-2"><XCircle className="h-4 w-4 shrink-0 text-destructive" /> {i}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="font-display text-2xl font-bold">Available pros</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {matched.map(p => (
                  <div key={p.id} className="flex items-center gap-4 rounded-2xl border bg-card p-4">
                    <div className="grid h-14 w-14 place-items-center rounded-full gradient-soft text-2xl">{p.img}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-display font-semibold">{p.name} {p.verified && <BadgeCheck className="h-4 w-4 text-primary" />}</div>
                      <div className="text-xs text-muted-foreground">{p.exp} · {p.area}</div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-warning"><Star className="h-3 w-3 fill-current" /> {p.rating} · {p.jobs} jobs</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="font-display text-2xl font-bold">Customer reviews</h2>
              <div className="mt-4 space-y-4">
                {reviews.map(r => (
                  <div key={r.id} className="rounded-2xl border bg-card p-5">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{r.customer}</div>
                      <div className="flex items-center gap-1 text-warning text-xs">{[...Array(r.rating)].map((_,i)=><Star key={i} className="h-3 w-3 fill-current" />)}</div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">"{r.text}"</p>
                    <div className="mt-2 text-xs text-muted-foreground">{r.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking side card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border bg-card p-6 shadow-elevated">
              <div className="text-sm text-muted-foreground">Starting at</div>
              <div className="font-display text-4xl font-bold">${service.price}</div>
              <div className="mt-1 text-xs text-muted-foreground">Final price after inspection.</div>
              <Button asChild variant="hero" size="lg" className="mt-5 w-full"><Link to={`/book/${service.id}`}>Book service</Link></Button>
              <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Shield className="h-3.5 w-3.5 text-primary" /> 100% money-back guarantee</div>
                <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-primary" /> Same-day available</div>
                <div className="flex items-center gap-2"><BadgeCheck className="h-3.5 w-3.5 text-primary" /> Verified professionals</div>
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
