import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  MapPin,
  Shield,
  Clock,
  Star,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import heroImg from "@/assets/hero-services.jpg";
import { useQuery } from "@tanstack/react-query";
import { api, assetUrl } from "@/lib/api";
import { getServiceImage } from "@/lib/utils";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: remoteCategories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    },
  });

  const { data: remoteServices = [] } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await api.get("/services");
      return res.data;
    },
  });

  const { data: allReviews = [] } = useQuery({
    queryKey: ["reviews"],
    queryFn: () => api.get("/reviews").then((r) => r.data),
  });

  const ratingsByService: Record<string, { sum: number; count: number }> = {};
  (allReviews as any[]).forEach((r: any) => {
    const sid = r.service?.id;
    if (!sid || !r.rating) return;
    if (!ratingsByService[sid]) ratingsByService[sid] = { sum: 0, count: 0 };
    ratingsByService[sid].sum += r.rating;
    ratingsByService[sid].count += 1;
  });

  const services = remoteServices.map((s: any) => {
    const stats = ratingsByService[s.id];
    return {
      id: s.id,
      name: s.title,
      price: s.price,
      img: s.imageUrl ? assetUrl(s.imageUrl) : getServiceImage(s.title, s.category?.name || ""),
      rating: stats ? (stats.sum / stats.count).toFixed(1) : null,
      reviews: stats?.count || 0,
    };
  });

  const categories = remoteCategories
    .filter((c: any) => c.isActive !== false)
    .map((c: any) => ({
    ...c,
    image: getServiceImage(c.name),
    count: c.services?.length || 0,
  }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    const matchedCategory = (remoteCategories as any[]).find((c: any) =>
      c.name.toLowerCase().includes(q.toLowerCase()),
    );
    if (q && matchedCategory) {
      navigate(`/services?category=${matchedCategory.id}`);
    } else if (q) {
      navigate(`/services?q=${encodeURIComponent(q)}`);
    } else {
      navigate("/services");
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 gradient-soft" />
        <div className="container grid gap-8 py-10 md:grid-cols-2 md:py-16 md:gap-8">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> 4.9 ★ rated by 50k+ homes
            </span>
            <h1 className="font-display text-4xl font-bold leading-[1.05] text-balance md:text-6xl">
              Book Trusted Home Services{" "}
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Near You
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Verified electricians, plumbers, cleaners and more — at your
              doorstep in as little as 60 minutes.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-8 flex flex-col gap-2 rounded-2xl border bg-card p-2 shadow-soft sm:flex-row"
            >
              <div className="flex flex-1 items-center gap-2 px-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  name="hero-search"
                  aria-label="Search services"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What do you need fixed today?"
                  className="border-0 shadow-none focus-visible:ring-0"
                />
              </div>
              <Button type="submit" variant="hero" size="lg">
                Find a pro <ArrowRight />
              </Button>
            </form>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" /> Background-verified
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> On-time guarantee
              </span>
              <span className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" /> Top-rated pros
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] gradient-hero opacity-20 blur-3xl" />
            <img
              src={heroImg}
              alt="Friendly home service professional"
              width={1600}
              height={1200}
              className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-elevated md:aspect-[5/6]"
            />
            <div className="absolute -bottom-6 -left-6 hidden w-60 rounded-2xl border bg-card p-4 shadow-elevated md:block">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-success/15">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Job Completed</div>
                  <div className="text-xs text-muted-foreground">
                    AC service · 4.9 ★
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 top-10 hidden w-56 rounded-2xl border bg-card p-4 shadow-elevated md:block">
              <div className="text-xs text-muted-foreground">Arriving In</div>
              <div className="font-display text-2xl font-bold">42 mins</div>
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> 1.2 km away
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Browse by category
            </h2>
            <p className="mt-2 text-muted-foreground">
              Pick a service category and we'll match you with a pro.
            </p>
          </div>
          <Link
            to="/services"
            className="hidden text-sm font-medium text-primary hover:underline md:block"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((c: any) => (
            <Link
              key={c.id}
              to={`/services?category=${c.id}`}
              className="group rounded-2xl border overflow-hidden bg-card transition-all hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className="relative h-28 overflow-hidden">
                <img
                  src={c.image}
                  alt={c.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
              <div className="p-3">
                <div className="font-display font-semibold text-sm">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.count} services</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular services */}
      <section className="bg-secondary/40 py-12">
        <div className="container">
          <h2 className="mb-6 font-display text-3xl font-bold md:text-4xl">
            Popular services
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.slice(0, 4).map((s) => (
              <Link
                key={s.id}
                to={`/services/${s.id}`}
                className="flex flex-col group overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:shadow-elevated"
              >
                <div className="h-44 shrink-0 w-full overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  {s.rating ? (
                  <div className="flex items-center gap-1 text-xs text-warning">
                    <Star className="h-3 w-3 fill-current" /> {s.rating}{" "}
                    <span className="text-muted-foreground">({s.reviews})</span>
                  </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3" /> No reviews yet
                    </div>
                  )}
                  <div className="mt-1 font-display font-semibold">
                    {s.name}
                  </div>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      From{" "}
                      <span className="font-semibold text-foreground">
                        ${s.price}
                      </span>
                    </span>
                    <span className="text-xs text-primary group-hover:underline">
                      Book →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container py-12" id="how-it-works">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            How it works
          </h2>
          <p className="mt-3 text-muted-foreground">
            Three simple steps to a sorted home.
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Choose a service",
              d: "Browse 100+ services across 8 categories.",
              icon: Search,
            },
            {
              n: "02",
              t: "Pick date & time",
              d: "Slot it in when it fits your day.",
              icon: Calendar,
            },
            {
              n: "03",
              t: "Get it done",
              d: "A verified pro arrives at your doorstep.",
              icon: CheckCircle2,
            },
          ].map((s) => (
            <div
              key={s.n}
              className="relative rounded-2xl border bg-card p-7 shadow-soft"
            >
              <div className="font-display text-5xl font-bold text-primary/15">
                {s.n}
              </div>
              <s.icon className="absolute right-6 top-6 h-7 w-7 text-primary" />
              <h3 className="mt-2 font-display text-xl font-bold">{s.t}</h3>
              <p className="mt-2 text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="container py-12">
        <div className="rounded-3xl gradient-hero p-8 text-primary-foreground md:p-12">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                Why Ustaad
              </h2>
              <p className="mt-3 text-primary-foreground/85">
                Built around trust, speed and quality.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                ["Verified pros", "Background checks on every provider."],
                ["Upfront pricing", "No surprises. Pay what's quoted."],
                ["Same-day service", "Often in under an hour."],
                ["Service guarantee", "Re-do or money back, always."],
              ].map(([t, d]) => (
                <div
                  key={t}
                  className="rounded-2xl bg-primary-foreground/10 p-5 backdrop-blur"
                >
                  <div className="font-display font-semibold">{t}</div>
                  <div className="mt-1 text-sm text-primary-foreground/80">
                    {d}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container pb-12">
        <h2 className="mb-6 text-center font-display text-3xl font-bold md:text-4xl">
          Loved by 50,000+ homes
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              n: "Hina A.",
              q: "Booked a cleaner at 9am, home sparkling by noon. Effortless.",
            },
            {
              n: "Bilal R.",
              q: "Electrician fixed our wiring same day at a fair price. Will use again.",
            },
            {
              n: "Ayesha K.",
              q: "Loved tracking my booking in real-time. Top-tier experience.",
            },
          ].map((t) => (
            <div
              key={t.n}
              className="rounded-2xl border bg-card p-6 shadow-soft"
            >
              <div className="flex gap-1 text-warning">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-foreground/90">"{t.q}"</p>
              <div className="mt-4 text-sm font-semibold">{t.n}</div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default Index;
