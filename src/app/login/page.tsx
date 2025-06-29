"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
      <Button
        className="w-full mb-4 bg-blue-600 hover:bg-blue-700"
        onClick={() => signIn("google")}
        aria-label="Sign in with Google"
      >
        Sign in with Google
      </Button>
      <div className="text-center text-sm text-muted-foreground mb-4">or</div>
      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <Button
        className="w-full mt-4 text-blue-600 underline"
        onClick={() => router.push("/register")}
      >
        Don&apos;t have an account? Register
      </Button>
      {error && (
        <p role="alert" className="text-red-600 mt-4 text-center font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
