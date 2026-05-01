import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Search, Star, SlidersHorizontal } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { categories, services } from "@/data/mock";
import { cn } from "@/lib/utils";

const Services = () => {
  const [params] = useSearchParams();
  const [cat, setCat] = useState<string | null>(params.get("category"));
  const [q, setQ] = useState("");
  const [price, setPrice] = useState([200]);
  const [minRating, setMinRating] = useState(0);

  const filtered = useMemo(() =>
    services.filter(s =>
      (!cat || s.category === cat) &&
      (!q || s.name.toLowerCase().includes(q.toLowerCase())) &&
      s.price <= price[0] &&
      s.rating >= minRating
    ), [cat, q, price, minRating]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="gradient-soft py-12">
        <div className="container">
          <h1 className="font-display text-4xl font-bold">All services</h1>
          <p className="mt-2 text-muted-foreground">{filtered.length} services available in your area.</p>
          <div className="mt-6 flex items-center gap-2 rounded-2xl border bg-card p-2 shadow-soft">
            <Search className="ml-2 h-5 w-5 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search services..." className="border-0 shadow-none focus-visible:ring-0" />
          </div>
        </div>
      </section>

      <section className="container py-10">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-6">
            <div className="rounded-2xl border bg-card p-5">
              <div className="mb-3 flex items-center gap-2 font-display font-semibold"><SlidersHorizontal className="h-4 w-4" /> Filters</div>
              <div>
                <div className="mb-2 text-sm font-medium">Category</div>
                <div className="space-y-1">
                  <button onClick={() => setCat(null)} className={cn("block w-full rounded-lg px-3 py-2 text-left text-sm", !cat ? "bg-primary/10 text-primary" : "hover:bg-secondary")}>All categories</button>
                  {categories.map(c => (
                    <button key={c.id} onClick={() => setCat(c.id)} className={cn("block w-full rounded-lg px-3 py-2 text-left text-sm", cat === c.id ? "bg-primary/10 text-primary" : "hover:bg-secondary")}>{c.name}</button>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm font-medium">Price <span className="text-muted-foreground">up to ${price[0]}</span></div>
                <Slider value={price} onValueChange={setPrice} max={300} step={10} />
              </div>
              <div className="mt-6">
                <div className="mb-2 text-sm font-medium">Minimum rating</div>
                <div className="flex gap-1">
                  {[0,3,4,4.5].map(r => (
                    <button key={r} onClick={() => setMinRating(r)} className={cn("rounded-lg border px-3 py-1.5 text-xs", minRating === r ? "border-primary bg-primary/10 text-primary" : "")}>{r === 0 ? "Any" : `${r}+`}</button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map(s => (
              <Link key={s.id} to={`/services/${s.id}`} className="group rounded-2xl border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-elevated">
                <div className="mb-4 grid h-32 place-items-center rounded-xl gradient-soft text-5xl">{s.img}</div>
                <div className="flex items-center gap-1 text-xs text-warning"><Star className="h-3 w-3 fill-current" /> {s.rating} <span className="text-muted-foreground">({s.reviews})</span></div>
                <div className="mt-1 font-display text-lg font-semibold">{s.name}</div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{s.desc}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">From <span className="font-bold text-foreground">${s.price}</span></span>
                  <Button size="sm" variant="hero">Book now</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default Services;
