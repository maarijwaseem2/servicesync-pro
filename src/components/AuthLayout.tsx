import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { ReactNode } from "react";

export const AuthLayout = ({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) => (
  <div className="grid min-h-screen lg:grid-cols-2">
    <div className="relative hidden gradient-hero p-12 text-primary-foreground lg:flex lg:flex-col">
      <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-foreground/15 backdrop-blur"><Sparkles className="h-5 w-5" /></span>
        Ustaad
      </Link>
      <div className="mt-auto">
        <h2 className="font-display text-4xl font-bold leading-tight">Trusted home services, just a tap away.</h2>
        <p className="mt-4 text-primary-foreground/85">Join thousands of homeowners and pros on the platform built for trust, speed, and quality.</p>
        <div className="mt-8 flex gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-12 w-12 rounded-full border-2 border-primary-foreground/40 bg-primary-foreground/10" />)}
          <div className="self-center text-sm text-primary-foreground/85">+50,000 happy homes</div>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-center p-8 sm:p-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center gap-2 font-display text-xl font-bold lg:hidden">
          <span className="grid h-9 w-9 place-items-center rounded-xl gradient-hero"><Sparkles className="h-5 w-5 text-primary-foreground" /></span>
          Ustaad
        </Link>
        <h1 className="font-display text-3xl font-bold">{title}</h1>
        {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-8 text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
    </div>
  </div>
);
