import { Link } from "react-router-dom";
import { Search, Calendar, MapPin, Shield, Clock, Star, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { categories, services } from "@/data/mock";
import heroImg from "@/assets/hero-services.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 gradient-soft" />
        <div className="container grid gap-12 py-16 md:grid-cols-2 md:py-24 md:gap-8">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> 4.9 ★ rated by 50k+ homes
            </span>
            <h1 className="font-display text-4xl font-bold leading-[1.05] text-balance md:text-6xl">
              Book trusted home services <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">near you</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Verified electricians, plumbers, cleaners and more — at your doorstep in as little as 60 minutes.
            </p>

            <div className="mt-8 flex flex-col gap-2 rounded-2xl border bg-card p-2 shadow-soft sm:flex-row">
              <div className="flex flex-1 items-center gap-2 px-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input placeholder="What do you need fixed today?" className="border-0 shadow-none focus-visible:ring-0" />
              </div>
              <Button asChild variant="hero" size="lg"><Link to="/services">Find a pro <ArrowRight /></Link></Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Background-verified</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> On-time guarantee</span>
              <span className="flex items-center gap-2"><Star className="h-4 w-4 text-primary" /> Top-rated pros</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] gradient-hero opacity-20 blur-3xl" />
            <img src={heroImg} alt="Friendly home service professional" width={1600} height={1200} className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-elevated md:aspect-[5/6]" />
            <div className="absolute -bottom-6 -left-6 hidden w-60 rounded-2xl border bg-card p-4 shadow-elevated md:block">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-success/15"><CheckCircle2 className="h-5 w-5 text-success" /></div>
                <div>
                  <div className="text-sm font-semibold">Job completed</div>
                  <div className="text-xs text-muted-foreground">AC service · 4.9 ★</div>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 top-10 hidden w-56 rounded-2xl border bg-card p-4 shadow-elevated md:block">
              <div className="text-xs text-muted-foreground">Arriving in</div>
              <div className="font-display text-2xl font-bold">42 min</div>
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> 1.2 km away</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Browse by category</h2>
            <p className="mt-2 text-muted-foreground">Pick a service category and we'll match you with a pro.</p>
          </div>
          <Link to="/services" className="hidden text-sm font-medium text-primary hover:underline md:block">View all →</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((c) => (
            <Link key={c.id} to={`/services?category=${c.id}`} className="group rounded-2xl border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-elevated">
              <div className={`mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${c.color} text-white shadow-soft`}>
                <c.icon className="h-6 w-6" />
              </div>
              <div className="font-display font-semibold">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.count} services</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular services */}
      <section className="bg-secondary/40 py-16">
        <div className="container">
          <h2 className="mb-10 font-display text-3xl font-bold md:text-4xl">Popular services</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.slice(0, 4).map((s) => (
              <Link key={s.id} to={`/services/${s.id}`} className="group rounded-2xl border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-elevated">
                <div className="mb-4 grid h-32 place-items-center rounded-xl gradient-soft text-5xl">{s.img}</div>
                <div className="flex items-center gap-1 text-xs text-warning"><Star className="h-3 w-3 fill-current" /> {s.rating} <span className="text-muted-foreground">({s.reviews})</span></div>
                <div className="mt-1 font-display font-semibold">{s.name}</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">From <span className="font-semibold text-foreground">${s.price}</span></span>
                  <span className="text-xs text-primary group-hover:underline">Book →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container py-20" id="how-it-works">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">How it works</h2>
          <p className="mt-3 text-muted-foreground">Three simple steps to a sorted home.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { n: "01", t: "Choose a service", d: "Browse 100+ services across 8 categories." , icon: Search},
            { n: "02", t: "Pick date & time", d: "Slot it in when it fits your day.", icon: Calendar },
            { n: "03", t: "Get it done", d: "A verified pro arrives at your doorstep.", icon: CheckCircle2 },
          ].map((s) => (
            <div key={s.n} className="relative rounded-2xl border bg-card p-7 shadow-soft">
              <div className="font-display text-5xl font-bold text-primary/15">{s.n}</div>
              <s.icon className="absolute right-6 top-6 h-7 w-7 text-primary" />
              <h3 className="mt-2 font-display text-xl font-bold">{s.t}</h3>
              <p className="mt-2 text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="container py-16">
        <div className="rounded-3xl gradient-hero p-10 text-primary-foreground md:p-16">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold md:text-4xl">Why HomeHero</h2>
              <p className="mt-3 text-primary-foreground/85">Built around trust, speed and quality.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                ["Verified pros", "Background checks on every provider."],
                ["Upfront pricing", "No surprises. Pay what's quoted."],
                ["Same-day service", "Often in under an hour."],
                ["Service guarantee", "Re-do or money back, always."],
              ].map(([t, d]) => (
                <div key={t} className="rounded-2xl bg-primary-foreground/10 p-5 backdrop-blur">
                  <div className="font-display font-semibold">{t}</div>
                  <div className="mt-1 text-sm text-primary-foreground/80">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container pb-20">
        <h2 className="mb-10 text-center font-display text-3xl font-bold md:text-4xl">Loved by 50,000+ homes</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { n: "Hina A.", q: "Booked a cleaner at 9am, home sparkling by noon. Effortless." },
            { n: "Bilal R.", q: "Electrician fixed our wiring same day at a fair price. Will use again." },
            { n: "Ayesha K.", q: "Loved tracking my booking in real-time. Top-tier experience." },
          ].map((t) => (
            <div key={t.n} className="rounded-2xl border bg-card p-6 shadow-soft">
              <div className="flex gap-1 text-warning">{[...Array(5)].map((_,i)=><Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <p className="mt-3 text-foreground/90">"{t.q}"</p>
              <div className="mt-4 text-sm font-semibold">{t.n}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <div className="overflow-hidden rounded-3xl border bg-card p-10 shadow-elevated md:p-16">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold md:text-4xl text-balance">Get the HomeHero app and book in seconds.</h2>
              <p className="mt-3 text-muted-foreground">Track providers in real time, manage all bookings, and earn loyalty rewards.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="hero" size="lg">App Store</Button>
                <Button variant="outline" size="lg">Google Play</Button>
              </div>
            </div>
            <div className="rounded-2xl gradient-soft p-8">
              <div className="font-display text-sm uppercase tracking-wider text-primary">Quick links</div>
              <ul className="mt-4 grid gap-3">
                <li><Link to="/admin" className="flex items-center justify-between rounded-xl border bg-card p-3 hover:shadow-soft">Admin Dashboard <ArrowRight className="h-4 w-4" /></Link></li>
                <li><Link to="/provider" className="flex items-center justify-between rounded-xl border bg-card p-3 hover:shadow-soft">Provider Portal <ArrowRight className="h-4 w-4" /></Link></li>
                <li><Link to="/crm" className="flex items-center justify-between rounded-xl border bg-card p-3 hover:shadow-soft">Sales CRM <ArrowRight className="h-4 w-4" /></Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default Index;
