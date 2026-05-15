import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { toast } from "sonner";

const slots = [
  "8:00 AM",
  "10:00 AM",
  "12:00 PM",
  "2:00 PM",
  "4:00 PM",
  "6:00 PM",
];

const BookingForm = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();

  const { data: service, isLoading } = useQuery({
    queryKey: ["services", id],
    queryFn: async () => {
      const res = await api.get(`/services/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const [date, setDate] = useState<Date>();
  const [slot, setSlot] = useState<string>();
  const [payment, setPayment] = useState("Online");
  const [done, setDone] = useState(false);

  if (isLoading)
    return (
      <div className="container py-20 text-center">
        Loading service details...
      </div>
    );
  if (!service)
    return (
      <div className="container py-20 text-center">Service not found.</div>
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.info("Please login to confirm your booking.");
      nav("/login");
      return;
    }

    if (!date || !slot) {
      toast.error("Pick a date and time slot.");
      return;
    }

    // Call API to create booking
    try {
      await api.post("/bookings", {
        serviceId: service.id,
        date: format(date, "yyyy-MM-dd"),
        time: slot,
        paymentMethod: payment,
        specialInstructions: (e.target as any).notes?.value || "",
      });
      setDone(true);
    } catch (err) {
      toast.error("Failed to create booking.");
    }
  };

  if (done) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="container grid place-items-center py-20">
          <div className="max-w-md rounded-3xl border bg-card p-10 text-center shadow-elevated">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/15">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-bold">
              Booking confirmed!
            </h1>
            <p className="mt-2 text-muted-foreground">
              We've notified the closest verified pro. You'll get a call
              shortly.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Button asChild variant="hero">
                <Link to="/bookings">View my bookings</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/">Back to home</Link>
              </Button>
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container py-10">
        <h1 className="font-display text-3xl font-bold">Book service</h1>
        <p className="text-muted-foreground">
          Fill in a few details and we'll handle the rest.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]"
        >
          <div className="space-y-5 rounded-2xl border bg-card p-6 shadow-soft">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Full name</Label>
                <Input
                  required
                  defaultValue={user?.name}
                  placeholder="Jane Cooper"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  required
                  type="tel"
                  placeholder="+1 555 1234"
                  className="mt-1.5"
                />
              </div>
            </div>
            <div>
              <Label>Address</Label>
              <Input
                required
                placeholder="Street, building, apt #"
                className="mt-1.5"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>City / Area</Label>
                <Input required placeholder="Downtown" className="mt-1.5" />
              </div>
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "mt-1.5 w-full justify-start font-normal",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon />{" "}
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(d) =>
                        d < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label>Time slot</Label>
              <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {slots.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSlot(s)}
                    className={cn(
                      "rounded-lg border px-2 py-2 text-sm transition-colors",
                      slot === s
                        ? "border-primary bg-primary/10 text-primary"
                        : "hover:bg-secondary",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Additional notes</Label>
              <Textarea
                name="notes"
                placeholder="Anything we should know? (Optional)"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Payment method</Label>
              <RadioGroup
                value={payment}
                onValueChange={setPayment}
                className="mt-2 grid grid-cols-2 gap-3"
              >
                {["Online", "Cash"].map((p) => (
                  <label
                    key={p}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border p-4",
                      payment === p && "border-primary bg-primary/5",
                    )}
                  >
                    <RadioGroupItem value={p} />
                    <div>
                      <div className="font-medium">{p}</div>
                      <div className="text-xs text-muted-foreground">
                        {p === "Online" ? "Card / wallet" : "Pay after service"}
                      </div>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>
          </div>

          <aside>
            <div className="sticky top-24 space-y-4 rounded-2xl border bg-card p-6 shadow-elevated">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border">
                  <img
                    src={service.imageUrl || "/assets/deep-cleaning.jfif"}
                    alt={service.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-display font-semibold">
                    {service.title}
                  </div>
                  <div className="text-xs text-muted-foreground">1-2 hrs</div>
                </div>
              </div>
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span>${service.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Visit fee</span>
                  <span>$5</span>
                </div>
                <div className="flex justify-between font-display text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>${Number(service.price) + 5}</span>
                </div>
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full">
                Confirm booking
              </Button>
            </div>
          </aside>
        </form>
      </div>
      <SiteFooter />
    </div>
  );
};

export default BookingForm;
