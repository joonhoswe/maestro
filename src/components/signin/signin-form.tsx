"use client";

import { useState, FormEvent } from "react";
import { MagicCard } from "@/components/magicui/magic-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email: email,
        password: password,
      }
    );

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else if (data.user) {
      // Redirect to dashboard upon successful login
      router.push("/dashboard");
    } else {
      setError("An unexpected issue occurred during sign in.");
      setLoading(false);
    }
  };

  return (
    <Card className="p-0 max-w-sm w-full shadow-none border-none">
      <MagicCard gradientColor={"#D9D9D955"} className="p-0">
        <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your details to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <form onSubmit={handleSignIn}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="text-sm text-right">
                <Link
                  href="/forgot-password"
                  className="text-[#800020] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
            <div className="text-sm text-center mt-4">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#800020] hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </MagicCard>
    </Card>
  );
}
