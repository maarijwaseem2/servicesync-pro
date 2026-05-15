import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";
import { decodeJwtPayload } from "../lib/jwt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/signup", {
        email,
        password,
        role,
        name,
      });

      const payload = decodeJwtPayload(data.access_token);

      login(data.access_token, {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        name: payload.name || name,
      });

      if (payload.role === "PROVIDER") navigate("/provider");
      else navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 p-4">
      <form
        onSubmit={handleSignup}
        className="p-8 bg-white border border-slate-200 shadow-sm rounded-xl space-y-6 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 text-center">
          Join ServiceSync Pro
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="space-y-4">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              I want to:
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="CUSTOMER"
                  checked={role === "CUSTOMER"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span className="text-sm">Find Services</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="PROVIDER"
                  checked={role === "PROVIDER"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span className="text-sm">Offer Services</span>
              </label>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-slate-900 text-white hover:bg-slate-800"
        >
          Sign Up
        </Button>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-slate-900 font-semibold hover:underline"
          >
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}
