import { Link, useLocation } from "react-router-dom";
import { Layers, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "../hooks/useAuth";

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const links = [
    { to: "/services", label: "Services" },
    { to: "/how-it-works", label: "How it works" },
    { to: "/bookings", label: "My bookings" },
  ];

  const getDashboardLink = () => {
    if (!user) return null;
    if (user.role === "ADMIN") return "/admin";
    if (user.role === "PROVIDER") return "/provider";
    return "/profile";
  };

  const dashboardLink = getDashboardLink();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-xl font-bold"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 shadow-glow">
            <Layers className="h-5 w-5 text-sky-400" />
          </span>
          <span>ServiceSync Pro</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === l.to ? "text-primary" : "text-muted-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <Link
              to={dashboardLink!}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Dashboard
            </Link>
          )}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {!user ? (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild variant="hero">
                <Link to="/signup">Get started</Link>
              </Button>
            </>
          ) : (
            <Button variant="ghost" onClick={logout}>
              Log out
            </Button>
          )}
        </div>
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t bg-background md:hidden">
          <div className="container flex flex-col gap-3 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium"
              >
                {l.label}
              </Link>
            ))}
            {user && (
              <Link
                to={dashboardLink!}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium"
              >
                Dashboard
              </Link>
            )}
            <div className="flex gap-2 pt-2">
              {!user ? (
                <>
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/login">Log in</Link>
                  </Button>
                  <Button asChild variant="hero" className="flex-1">
                    <Link to="/signup">Get started</Link>
                  </Button>
                </>
              ) : (
                <Button variant="outline" className="flex-1" onClick={logout}>
                  Log out
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
