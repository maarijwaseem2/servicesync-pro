import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CheckCircle2 } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      title: "Select a Service",
      desc: "Browse from our comprehensive list of over 20+ verified home repair and cleaning services.",
      icon: "1",
    },
    {
      title: "Choose a Time",
      desc: "Pick a date and specific time slot that works best for your busy schedule.",
      icon: "2",
    },
    {
      title: "We Do the Rest",
      desc: "A top-rated verified professional will arrive at your doorstep, fully equipped to get the job done.",
      icon: "3",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-secondary/40 py-10 md:py-16">
          <div className="container max-w-4xl text-center">
            <h1 className="font-display text-4xl font-bold md:text-5xl">
              How Ustaad works
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Three simple steps to a sorted, spotless, and repaired home.
            </p>
          </div>
        </section>

        <section className="container py-12">
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary mb-6">
                  {s.icon}
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">
                  {s.title}
                </h3>
                <p className="text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-3xl bg-card border shadow-soft p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="font-display text-3xl font-bold mb-4">
                Ready to book a professional?
              </h2>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 md:justify-start justify-center text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-primary" /> Verified
                  Professionals
                </li>
                <li className="flex items-center gap-2 md:justify-start justify-center text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-primary" /> Transparent
                  Pricing
                </li>
                <li className="flex items-center gap-2 md:justify-start justify-center text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-primary" /> Satisfaction
                  Guarantee
                </li>
              </ul>
              <a
                href="/services"
                className="inline-block rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Browse Services
              </a>
            </div>
            <div className="flex-1">
              <img
                src="/assets/hero-services.jpg"
                alt="Professional at work"
                className="rounded-2xl object-cover h-64 w-full shadow-elevated"
              />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default HowItWorks;
