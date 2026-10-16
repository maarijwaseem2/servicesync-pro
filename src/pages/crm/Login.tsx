import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Lock, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const CRMLogin = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col bg-sidebar p-12 text-sidebar-foreground lg:flex">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-sidebar-primary-foreground">
          <span className="grid h-9 w-9 place-items-center rounded-xl gradient-hero"><BarChart3 className="h-5 w-5 text-primary-foreground" /></span>
          Ustaad
        </Link>
        <div className="mt-auto">
          <h2 className="font-display text-4xl font-bold leading-tight text-sidebar-primary-foreground">Close more deals with less effort.</h2>
          <p className="mt-4 text-sidebar-foreground/80">Track leads, manage follow-ups, and visualize your sales pipeline — built for small, fast-moving teams.</p>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {[
              { v: "+38%", l: "Win rate" },
              { v: "12m", l: "Avg follow-up" },
              { v: "2.4x", l: "More deals" },
            ].map(s => (
              <div key={s.l} className="rounded-xl border border-sidebar-border bg-sidebar-accent p-4">
                <div className="font-display text-2xl font-bold text-sidebar-primary-foreground">{s.v}</div>
                <div className="text-xs text-sidebar-foreground/70">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-2 font-display text-xl font-bold lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-hero"><Sparkles className="h-5 w-5 text-primary-foreground" /></span>
            Ustaad
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"><Lock className="h-3 w-3" /> Admin only</span>
          <h1 className="mt-3 font-display text-3xl font-bold">Sign in to Ustaad</h1>
          <p className="mt-2 text-muted-foreground">Enter your admin credentials to continue.</p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              setTimeout(() => { toast.success("Welcome back"); nav("/crm"); }, 600);
            }}
          >
            <div><Label htmlFor="crm-email">Email</Label><Input id="crm-email" name="email" autoComplete="email" className="mt-1.5" type="email" required defaultValue="admin@pipeline.app" /></div>
            <div>
              <div className="flex items-center justify-between"><Label htmlFor="crm-password">Password</Label><Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link></div>
              <Input id="crm-password" name="password" autoComplete="current-password" className="mt-1.5" type="password" required defaultValue="••••••••" />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CRMLogin;
