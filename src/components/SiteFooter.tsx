import { Link } from "react-router-dom";
import { Layers, Facebook, Twitter, Instagram } from "lucide-react";

export const SiteFooter = () => (
  <footer className="border-t bg-secondary/40">
    <div className="container grid gap-10 py-14 md:grid-cols-4">
      <div>
        <div className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900">
            <Layers className="h-5 w-5 text-sky-400" />
          </span>
          ServiceSync Pro
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Trusted home services, booked in seconds.
        </p>
        <div className="mt-4 flex gap-3 text-muted-foreground">
          <Facebook className="h-5 w-5 hover:text-primary cursor-pointer" />
          <Twitter className="h-5 w-5 hover:text-primary cursor-pointer" />
          <Instagram className="h-5 w-5 hover:text-primary cursor-pointer" />
        </div>
      </div>
      {[
        {
          title: "Company",
          links: [
            ["About", "/about"],
            ["Careers", "/careers"],
            ["Press", "/press"],
          ],
        },
        {
          title: "Services",
          links: [
            ["Electrician", "/services"],
            ["Plumber", "/services"],
            ["AC Repair", "/services"],
            ["Cleaning", "/services"],
          ],
        },
        {
          title: "For Pros",
          links: [
            ["Become a Pro", "/signup"],
            ["Provider login", "/login"],
            ["Admin", "/admin"],
            ["CRM", "/crm"],
          ],
        },
      ].map((c) => (
        <div key={c.title}>
          <div className="font-display font-semibold">{c.title}</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {c.links.map(([l, h]) => (
              <li key={l}>
                <Link to={h} className="hover:text-primary">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t py-6 text-center text-xs text-muted-foreground">
      © 2026 ServiceSync Pro. All rights reserved.
    </div>
  </footer>
);
