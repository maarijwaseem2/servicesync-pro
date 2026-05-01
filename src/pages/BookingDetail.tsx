import { Link, useParams } from "react-router-dom";
import { Calendar, MapPin, CreditCard, FileText, Phone, BadgeCheck } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { bookings } from "@/data/mock";
import { cn } from "@/lib/utils";

const steps: { key: string; label: string }[] = [
  { key: "Pending", label: "Booked" },
  { key: "Accepted", label: "Accepted" },
  { key: "In Progress", label: "In progress" },
  { key: "Completed", label: "Completed" },
];

const BookingDetail = () => {
  const { id } = useParams();
  const b = bookings.find(x => x.id === id) || bookings[0];
  const activeIdx = steps.findIndex(s => s.key === b.status);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container py-10">
        <Link to="/bookings" className="text-sm text-muted-foreground hover:text-primary">← Back to bookings</Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Booking #{b.id}</div>
            <h1 className="font-display text-3xl font-bold">{b.service}</h1>
          </div>
          <StatusBadge status={b.status} />
        </div>

        {/* tracker */}
        <div className="mt-8 rounded-2xl border bg-card p-6 shadow-soft">
          <div className="grid grid-cols-4 gap-2">
            {steps.map((s, i) => (
              <div key={s.key} className="flex flex-col items-center gap-2">
                <div className={cn("grid h-9 w-9 place-items-center rounded-full text-xs font-bold",
                  i <= activeIdx ? "gradient-hero text-primary-foreground shadow-glow" : "bg-secondary text-muted-foreground")}>
                  {i + 1}
                </div>
                <div className={cn("text-xs", i <= activeIdx ? "font-semibold" : "text-muted-foreground")}>{s.label}</div>
              </div>
            ))}
          </div>
          <div className="relative mt-3 h-1.5 rounded-full bg-secondary">
            <div className="h-full rounded-full gradient-hero transition-all" style={{ width: `${(activeIdx / (steps.length - 1)) * 100}%` }} />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <Section title="Service details">
              <Row icon={Calendar} label="Date & time" value={`${b.date} · ${b.time}`} />
              <Row icon={MapPin} label="Address" value={b.address} />
              <Row icon={CreditCard} label="Payment" value={`$${b.price} · ${b.payment}`} />
              <Row icon={FileText} label="Notes" value="—" />
            </Section>
            <Section title="Provider">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-full gradient-soft text-2xl">👨🏽‍🔧</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-semibold">{b.provider} <BadgeCheck className="h-4 w-4 text-primary" /></div>
                  <div className="text-xs text-muted-foreground">8 yrs experience · 4.9 ★</div>
                </div>
                <Button size="sm" variant="outline"><Phone className="h-4 w-4" /> Call</Button>
              </div>
            </Section>
          </div>

          <aside>
            <div className="rounded-2xl border bg-card p-6 shadow-elevated">
              <div className="font-display font-semibold">Need changes?</div>
              <div className="mt-3 space-y-2">
                {(b.status === "Pending" || b.status === "Accepted") && <Button variant="outline" className="w-full text-destructive">Cancel booking</Button>}
                {b.status === "Completed" && <Button variant="accent" className="w-full">Leave a review</Button>}
                <Button variant="ghost" className="w-full">Contact support</Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-2xl border bg-card p-6 shadow-soft">
    <div className="mb-3 font-display font-semibold">{title}</div>
    <div className="space-y-3">{children}</div>
  </div>
);
const Row = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-start gap-3 text-sm">
    <Icon className="mt-0.5 h-4 w-4 text-primary" />
    <div className="flex-1"><div className="text-xs text-muted-foreground">{label}</div><div className="font-medium">{value}</div></div>
  </div>
);

export default BookingDetail;
