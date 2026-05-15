import { Link } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const tabs = [
  "All",
  "Pending",
  "Accepted",
  "In Progress",
  "Completed",
  "Cancelled",
] as const;

const MyBookings = () => {
  const { data: bookingsData = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await api.get("/bookings");
      return res.data;
    },
  });

  const bookings = bookingsData.map((b: any) => {
    let uiStatus = "Pending";
    if (b.status === "CONFIRMED") uiStatus = "Accepted";
    if (b.status === "COMPLETED") uiStatus = "Completed";
    if (b.status === "CANCELLED") uiStatus = "Cancelled";

    return {
      id: b.id,
      service: b.service?.title || "Service",
      provider: b.provider?.name || "Pending Assignment...",
      date: b.date,
      time: b.time,
      address: b.specialInstructions || "Registered Location",
      status: uiStatus,
      price: b.totalAmount || b.service?.price || 0,
      payment: "Online",
    };
  });

  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const filtered = bookings.filter(
    (b: any) => tab === "All" || b.status === tab,
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold">My bookings</h1>
            <p className="text-muted-foreground">
              Track and manage your service appointments.
            </p>
          </div>
          <Button asChild variant="hero">
            <Link to="/services">Book another service</Link>
          </Button>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto border-b">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "relative whitespace-nowrap px-4 py-3 text-sm font-medium",
                tab === t
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
              {tab === t && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl border bg-card p-5 shadow-soft transition-shadow hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">#{b.id}</div>
                  <div className="font-display text-lg font-semibold">
                    {b.service}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    with {b.provider}
                  </div>
                </div>
                <StatusBadge status={b.status} />
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" /> {b.date} ·{" "}
                  {b.time}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> {b.address}
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  ${b.price} · {b.payment}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link to={`/bookings/${b.id}`}>View details</Link>
                </Button>
                {(b.status === "Pending" || b.status === "Accepted") && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                  >
                    Cancel
                  </Button>
                )}
                {b.status === "Completed" && (
                  <Button size="sm" variant="accent">
                    Leave review
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default MyBookings;
