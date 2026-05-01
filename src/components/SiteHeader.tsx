import { Link, useLocation } from "react-router-dom";
import { Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const links = [
    { to: "/services", label: "Services" },
    { to: "/how-it-works", label: "How it works" },
    { to: "/bookings", label: "My bookings" },
  ];
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl gradient-hero shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </span>
          <span>HomeHero</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === l.to ? "text-primary" : "text-muted-foreground"
            )}>{l.label}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost"><Link to="/login">Log in</Link></Button>
          <Button asChild variant="hero"><Link to="/signup">Get started</Link></Button>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t bg-background md:hidden">
          <div className="container flex flex-col gap-3 py-4">
            {links.map((l) => <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-2 text-sm font-medium">{l.label}</Link>)}
            <div className="flex gap-2 pt-2">
              <Button asChild variant="outline" className="flex-1"><Link to="/login">Log in</Link></Button>
              <Button asChild variant="hero" className="flex-1"><Link to="/signup">Get started</Link></Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
