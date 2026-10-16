import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";
import { decodeJwtPayload } from "../lib/jwt";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });

      const payload = decodeJwtPayload(data.access_token);

      login(data.access_token, {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        name: payload.name,
      });

      if (payload.role === "ADMIN") window.location.href = "/admin";
      else if (payload.role === "PROVIDER") window.location.href = "/provider";
      else window.location.href = "/";
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <form
        onSubmit={handleLogin}
        className="p-8 bg-white border border-slate-200 shadow-sm rounded-xl space-y-6 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 text-center">
          Log in to Ustaad
        </h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="space-y-4">
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            aria-label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
            required
          />
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Your Password"
            className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-white hover:bg-slate-900/90 h-10 px-4 py-2 w-full"
        >
          Sign In
        </button>

        <p className="text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-slate-900 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
