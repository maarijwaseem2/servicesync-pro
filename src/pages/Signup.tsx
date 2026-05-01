import { Link } from "react-router-dom";
import { useState } from "react";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const Signup = () => {
  const [role, setRole] = useState<"customer" | "provider">("customer");
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Choose how you'll use HomeHero."
      footer={<>Already have one? <Link to="/login" className="font-medium text-primary hover:underline">Log in</Link></>}
    >
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-secondary p-1">
        {(["customer","provider"] as const).map(r => (
          <button key={r} onClick={() => setRole(r)} className={cn("rounded-lg px-3 py-2 text-sm font-medium capitalize transition-colors", role === r ? "bg-card shadow-soft" : "text-muted-foreground")}>{r}</button>
        ))}
      </div>
      <form className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" />
          <Field label="Phone" type="tel" />
        </div>
        <Field label="Email" type="email" />
        <Field label="Password" type="password" />
        {role === "customer" ? (
          <Field label="City" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Service category</Label>
              <select className="mt-1.5 h-10 w-full rounded-md border bg-background px-3 text-sm">
                <option>Electrician</option><option>Plumber</option><option>AC Repair</option><option>Cleaning</option><option>Carpenter</option>
              </select>
            </div>
            <Field label="Experience (years)" type="number" />
            <Field label="City / area" />
          </div>
        )}
        <Button variant="hero" size="lg" className="w-full">Create account</Button>
      </form>
    </AuthLayout>
  );
};

const Field = ({ label, ...rest }: any) => (<div><Label>{label}</Label><Input className="mt-1.5" {...rest} /></div>);

export default Signup;
