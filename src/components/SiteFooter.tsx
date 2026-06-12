import { Link } from "react-router-dom";
import { Layers, Facebook, Twitter, Instagram } from "lucide-react";

const columns = [
  {
    title: "Explore",
    links: [
      ["Browse services", "/services"],
      ["How it works", "/how-it-works"],
    ],
  },
  {
    title: "Account",
    links: [
      ["Log in", "/login"],
      ["Create account", "/signup"],
    ],
  },
];

export const SiteFooter = () => {
  return (
    <footer className="border-t bg-secondary/40">
      <div className="container grid gap-10 py-10 md:grid-cols-3">
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
        {columns.map((c) => (
          <div key={c.title}>
            <div className="font-display font-semibold">{c.title}</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="hover:text-primary">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t py-6 text-center text-xs text-muted-foreground">
        © 2024 ServiceSync Pro. All rights reserved.
      </div>
    </footer>
  );
};
