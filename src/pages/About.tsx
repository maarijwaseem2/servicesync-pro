import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Shield, Zap, Heart, Users, Star, TrendingUp } from "lucide-react";

const stats = [
  { value: "12,000+", label: "Bookings completed" },
  { value: "850+", label: "Verified professionals" },
  { value: "4.8★", label: "Average rating" },
  { value: "6", label: "Cities covered" },
];

const values = [
  {
    icon: Shield,
    title: "Trust & Safety",
    desc: "Every professional is background-checked, ID-verified, and rated by real customers before joining our platform.",
  },
  {
    icon: Zap,
    title: "Speed",
    desc: "Book in under 60 seconds. Same-day availability for most services in major cities.",
  },
  {
    icon: Heart,
    title: "Customer Care",
    desc: "Our support team is available 7 days a week. Not happy? We'll make it right — guaranteed.",
  },
  {
    icon: TrendingUp,
    title: "Upfront Pricing",
    desc: "No hidden fees, no surprise invoices. You see the full cost before you confirm.",
  },
];

const team = [
  { name: "Maarij Waseem", role: "Co-founder & CEO", initials: "MW" },
  { name: "Sara Khan", role: "Head of Operations", initials: "SK" },
  { name: "Ali Hassan", role: "CTO", initials: "AH" },
  { name: "Bilal Ahmed", role: "Head of Growth", initials: "BA" },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">

        {/* Hero */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-10 pointer-events-none" />
          <div className="container max-w-3xl text-center relative">
            <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-medium text-primary mb-4">
              Our Story
            </span>
            <h1 className="font-display text-4xl font-bold md:text-5xl leading-tight">
              Reimagining home services — one booking at a time
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              ServiceSync Pro was built because booking a plumber shouldn't be
              harder than booking a flight. We connect trusted professionals with
              homeowners who deserve reliability, transparency, and great work.
            </p>
          </div>
        </section>

        {/* Stats bar */}
        <section className="border-y bg-card">
          <div className="container py-10">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-display text-3xl font-bold text-primary">
                    {s.value}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="container py-20 max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="font-display text-3xl font-bold mb-4">
                Our Mission
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                At ServiceSync Pro, we believe that caring for your home should
                feel effortless. Our platform connects busy homeowners with
                deeply verified, top-rated professionals for every home
                maintenance, cleaning, and repair need — with real-time
                tracking, transparent pricing, and a satisfaction guarantee.
              </p>
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                For professionals, we eliminate the headache of finding clients.
                ServiceSync Pro gives them a full business dashboard — bookings,
                earnings, reviews, and scheduling — all in one place.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="rounded-2xl border bg-card p-5 shadow-soft"
                >
                  <v.icon className="h-6 w-6 text-primary mb-3" />
                  <div className="font-display font-semibold mb-1">
                    {v.title}
                  </div>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="bg-secondary/40 py-20">
          <div className="container max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Founded in 2026, ServiceSync Pro started in a small apartment in
              Karachi after our co-founder spent three days trying to find a
              reliable electrician. We saw a systemic problem: a fragmented,
              trust-deficient market where homeowners overpaid and skilled
              professionals went underutilized.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Today we operate in 6 cities across Pakistan, with thousands of
              completed bookings and a growing community of verified
              professionals who rely on ServiceSync Pro as their primary source
              of income.
            </p>
          </div>
        </section>

        {/* Team */}
        <section className="container py-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold">Meet the team</h2>
            <p className="mt-2 text-muted-foreground">
              The people behind ServiceSync Pro
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            {team.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border bg-card p-6 text-center shadow-soft"
              >
                <div className="mx-auto h-20 w-20 rounded-full gradient-hero grid place-items-center text-2xl font-bold text-primary-foreground mb-4">
                  {t.initials}
                </div>
                <div className="font-display font-semibold">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.role}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-card border-t py-16">
          <div className="container max-w-2xl text-center">
            <Users className="mx-auto h-10 w-10 text-primary mb-4" />
            <h2 className="font-display text-2xl font-bold mb-3">
              Join our growing community
            </h2>
            <p className="text-muted-foreground mb-6">
              Whether you're a homeowner looking for reliable help or a
              professional ready to grow your business — ServiceSync Pro is for
              you.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl gradient-hero px-6 py-3 font-semibold text-primary-foreground shadow-glow hover:shadow-elevated transition-all"
              >
                <Star className="h-4 w-4" /> Get started free
              </a>
              <a
                href="/careers"
                className="inline-flex items-center gap-2 rounded-xl border bg-card px-6 py-3 font-semibold hover:bg-secondary transition-all"
              >
                View open roles
              </a>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
};

export default About;