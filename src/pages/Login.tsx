import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => (
  <AuthLayout
    title="Welcome back"
    subtitle="Log in to manage your bookings and account."
    footer={<>Don't have an account? <Link to="/signup" className="font-medium text-primary hover:underline">Sign up</Link></>}
  >
    <form className="space-y-4">
      <div><Label>Email or phone</Label><Input className="mt-1.5" placeholder="you@email.com" /></div>
      <div>
        <div className="flex items-center justify-between"><Label>Password</Label><Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link></div>
        <Input type="password" className="mt-1.5" placeholder="••••••••" />
      </div>
      <Button variant="hero" size="lg" className="w-full">Log in</Button>
      <div className="relative my-2 text-center text-xs text-muted-foreground">
        <span className="relative z-10 bg-background px-2">or continue with</span>
        <span className="absolute inset-x-0 top-1/2 -z-0 h-px bg-border" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" type="button">Google</Button>
        <Button variant="outline" type="button">Apple</Button>
      </div>
    </form>
  </AuthLayout>
);

export default Login;
