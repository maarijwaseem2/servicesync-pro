import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MapPin, Clock, ArrowRight, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

const openings = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Karachi / Remote",
    type: "Full-time",
    desc: "Build and scale our core booking platform using React, NestJS, and PostgreSQL. Own features end-to-end.",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Lahore / Remote",
    type: "Full-time",
    desc: "Shape the visual and interaction design of our consumer and provider apps. You'll work closely with engineers and PMs.",
  },
  {
    title: "City Operations Manager",
    department: "Operations",
    location: "Islamabad",
    type: "Full-time",
    desc: "Launch and grow ServiceSync Pro in a new city. You'll recruit providers, manage quality, and hit supply targets.",
  },
  {
    title: "Customer Support Lead",
    department: "Support",
    location: "Karachi",
    type: "Full-time",
    desc: "Lead our frontline support team and improve resolution rates and customer satisfaction scores.",
  },
  {
    title: "Growth Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    desc: "Drive customer and provider acquisition through performance channels — SEO, paid, referral, and partnerships.",
  },
  {
    title: "Mobile Engineer (React Native)",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    desc: "Build our iOS and Android apps from the ground up as we expand to mobile-first markets.",
  },
];

const perks = [
  { emoji: "🏠", label: "Remote-friendly" },
  { emoji: "🏥", label: "Health insurance" },
  { emoji: "📚", label: "Learning budget" },
  { emoji: "⚡", label: "Fast career growth" },
  { emoji: "🤝", label: "Equity options" },
  { emoji: "🌴", label: "Flexible PTO" },
];

const Careers = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">

        {/* Hero */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-10 pointer-events-none" />
          <div className="container max-w-3xl text-center relative">
            <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-medium text-primary mb-4">
              We're hiring
            </span>
            <h1 className="font-display text-4xl font-bold md:text-5xl leading-tight">
              Help us transform the home services industry
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Join a fast-growing team that's building the infrastructure for
              how millions of people find and hire home service professionals.
              We're remote-friendly, impact-driven, and moving fast.
            </p>
          </div>
        </section>

        {/* Perks */}
        <section className="border-y bg-card">
          <div className="container py-10">
            <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
              {perks.map((p) => (
                <div key={p.label} className="text-center">
                  <div className="text-3xl mb-1">{p.emoji}</div>
                  <div className="text-sm text-muted-foreground">{p.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open roles */}
        <section className="container py-20">
          <div className="mb-10">
            <h2 className="font-display text-3xl font-bold">Open positions</h2>
            <p className="mt-2 text-muted-foreground">
              {openings.length} roles across engineering, design, and operations.
            </p>
          </div>

          <div className="space-y-4 max-w-3xl">
            {openings.map((job) => (
              <div
                key={job.title}
                className="group rounded-2xl border bg-card p-6 shadow-soft hover:shadow-elevated transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-xs font-medium text-primary mb-1">
                      {job.department}
                    </div>
                    <h3 className="font-display text-lg font-semibold">
                      {job.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {job.desc}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" /> {job.type}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 group-hover:border-primary group-hover:text-primary transition-colors"
                    onClick={() =>
                      (window.location.href = `mailto:careers@servicesynpro.com?subject=Application: ${job.title}`)
                    }
                  >
                    Apply <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* No role fits? */}
        <section className="bg-secondary/40 py-16">
          <div className="container max-w-2xl text-center">
            <Briefcase className="mx-auto h-10 w-10 text-primary mb-4" />
            <h2 className="font-display text-2xl font-bold mb-3">
              Don't see the right role?
            </h2>
            <p className="text-muted-foreground mb-6">
              We're always looking for talented people. Send us your CV and tell
              us how you'd like to contribute.
            </p>
            <a
              href="mailto:careers@servicesynpro.com"
              className="inline-flex items-center gap-2 rounded-xl gradient-hero px-6 py-3 font-semibold text-primary-foreground shadow-glow hover:shadow-elevated transition-all"
            >
              Get in touch
            </a>
          </div>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
};

export default Careers;