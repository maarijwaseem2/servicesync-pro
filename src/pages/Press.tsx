import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ExternalLink, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const coverage = [
  {
    outlet: "Dawn Business",
    date: "March 2026",
    title: "ServiceSync Pro raises seed round to fix Pakistan's home services market",
    excerpt:
      "The Karachi-based startup is tackling a fragmented market with tech-driven vetting and real-time booking infrastructure.",
  },
  {
    outlet: "TechJuice",
    date: "February 2026",
    title: "Meet the startup making it easy to hire a plumber in Pakistan",
    excerpt:
      "ServiceSync Pro's booking platform has completed over 10,000 jobs in its first year, with 850 verified professionals across 6 cities.",
  },
  {
    outlet: "The News International",
    date: "January 2026",
    title: "Home services go digital: How Pakistani startups are changing trades",
    excerpt:
      "A new wave of platforms is bringing structure and trust to the country's informal home repair economy.",
  },
  {
    outlet: "Profit by Pakistan Today",
    date: "December 2025",
    title: "ServiceSync Pro launches provider dashboard with CRM tools",
    excerpt:
      "The new dashboard gives home service professionals a complete view of their pipeline, reviews, and earnings — for free.",
  },
];

const brandAssets = [
  { label: "Logo pack (SVG + PNG)", size: "2.1 MB" },
  { label: "Brand guidelines (PDF)", size: "4.8 MB" },
  { label: "Product screenshots", size: "12 MB" },
  { label: "Founder photos", size: "8.3 MB" },
];

const facts = [
  { value: "2025", label: "Year founded" },
  { value: "6", label: "Cities" },
  { value: "850+", label: "Professionals" },
  { value: "12,000+", label: "Bookings completed" },
];

const Press = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">

        {/* Hero */}
        <section className="relative py-20 md:py-24 overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-10 pointer-events-none" />
          <div className="container max-w-3xl text-center relative">
            <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-medium text-primary mb-4">
              Press & Media
            </span>
            <h1 className="font-display text-4xl font-bold md:text-5xl leading-tight">
              ServiceSync Pro in the news
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              For press inquiries, interview requests, or media assets, contact{" "}
              <a
                href="mailto:press@servicesynpro.com"
                className="text-primary underline-offset-2 hover:underline"
              >
                press@servicesynpro.com
              </a>
            </p>
          </div>
        </section>

        {/* Key facts */}
        <section className="border-y bg-card">
          <div className="container py-10">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {facts.map((f) => (
                <div key={f.label} className="text-center">
                  <div className="font-display text-3xl font-bold text-primary">
                    {f.value}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {f.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coverage */}
        <section className="container py-20">
          <h2 className="font-display text-3xl font-bold mb-8">
            Recent coverage
          </h2>
          <div className="space-y-4 max-w-3xl">
            {coverage.map((c) => (
              <div
                key={c.title}
                className="group rounded-2xl border bg-card p-6 shadow-soft hover:shadow-elevated transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-primary">
                        {c.outlet}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        · {c.date}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold leading-snug mb-2">
                      {c.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{c.excerpt}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Brand assets */}
        <section className="bg-secondary/40 py-16">
          <div className="container max-w-3xl">
            <h2 className="font-display text-3xl font-bold mb-2">
              Brand assets
            </h2>
            <p className="text-muted-foreground mb-8">
              Download our official logos, screenshots, and brand guidelines for
              editorial use.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {brandAssets.map((a) => (
                <div
                  key={a.label}
                  className="flex items-center justify-between rounded-2xl border bg-card p-4 shadow-soft"
                >
                  <div>
                    <div className="font-medium text-sm">{a.label}</div>
                    <div className="text-xs text-muted-foreground">{a.size}</div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-3.5 w-3.5" /> Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="container py-16 max-w-2xl text-center">
          <Mail className="mx-auto h-10 w-10 text-primary mb-4" />
          <h2 className="font-display text-2xl font-bold mb-3">
            Media contact
          </h2>
          <p className="text-muted-foreground mb-6">
            We respond to all press inquiries within one business day. For
            urgent requests, please mention "URGENT" in the subject line.
          </p>
          <a
            href="mailto:press@servicesynpro.com"
            className="inline-flex items-center gap-2 rounded-xl gradient-hero px-6 py-3 font-semibold text-primary-foreground shadow-glow hover:shadow-elevated transition-all"
          >
            <Mail className="h-4 w-4" /> press@servicesynpro.com
          </a>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
};

export default Press;