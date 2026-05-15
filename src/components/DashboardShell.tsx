import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Calendar,
  User,
  LogOut,
  Sparkles,
  Briefcase,
  Tags,
  Users,
  Settings,
  Star,
  Home,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../hooks/useAuth";

type Item = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const providerNav: Item[] = [
  { to: "/provider", label: "Dashboard", icon: LayoutDashboard },
  { to: "/provider/bookings", label: "Assigned Jobs", icon: ClipboardList },
  { to: "/provider/services", label: "My Services", icon: Wrench },
  { to: "/provider/availability", label: "Availability", icon: Calendar },
  { to: "/provider/profile", label: "Profile", icon: User },
];

const adminNav: Item[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/services", label: "Services", icon: Briefcase },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/providers", label: "Providers", icon: Users },
  { to: "/admin/bookings", label: "Bookings", icon: ClipboardList },
  { to: "/crm/leads", label: "Leads", icon: Users },
  { to: "/crm/pipeline", label: "Pipeline", icon: Briefcase },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const variants = { provider: providerNav, admin: adminNav, crm: adminNav };

export const DashboardShell = ({
  children,
  variant,
  title,
  subtitle,
  actions,
}: {
  children: React.ReactNode;
  variant: keyof typeof variants;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) => {
  const nav = variants[variant];
  const { logout } = useAuth();
  const brand =
    variant === "admin" || variant === "crm"
      ? "ServiceSync Admin"
      : "ServiceSync Pro";
  return (
    <div className="flex min-h-screen bg-secondary/30">
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
        <Link
          to="/"
          className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6 font-display font-bold text-sidebar-primary-foreground"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg gradient-hero">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="text-sidebar-foreground">{brand}</span>
        </Link>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              end={
                i.to === `/${variant}` ||
                i.to === "/admin" ||
                i.to === "/crm" ||
                i.to === "/provider"
              }
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )
              }
            >
              <i.icon className="h-4 w-4" />
              {i.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Home className="h-4 w-4" /> Back to site
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </aside>
      <main className="flex-1">
        <header className="flex flex-col gap-3 border-b bg-background px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {actions}
            <button
              type="button"
              onClick={logout}
              className="ml-2 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};
