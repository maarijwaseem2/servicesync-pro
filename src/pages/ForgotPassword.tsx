import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ForgotPassword = () => (
  <AuthLayout
    title="Reset your password"
    subtitle="Enter your email or phone and we'll send a reset link."
    footer={<>Remembered it? <Link to="/login" className="font-medium text-primary hover:underline">Log in</Link></>}
  >
    <form className="space-y-4">
      <div><Label>Email or phone</Label><Input className="mt-1.5" placeholder="you@email.com" /></div>
      <Button variant="hero" size="lg" className="w-full">Send reset link</Button>
    </form>
  </AuthLayout>
);

export default ForgotPassword;
