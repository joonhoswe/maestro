"use client";

import { useState, FormEvent, useEffect } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Eye, EyeOff } from "lucide-react";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";
  const { user, refreshSession } = useAuth();

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      router.push(decodeURIComponent(returnUrl));
    }
  }, [user, returnUrl, router]);

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
      // Refresh auth context
      await refreshSession();
      // Redirect to the return URL or dashboard upon successful login
      router.push(decodeURIComponent(returnUrl));
    } else {
      setError("An unexpected issue occurred during sign in.");
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
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
