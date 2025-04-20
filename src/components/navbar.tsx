"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);

      // Set up auth state listener for changes
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user ?? null);
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    }

    getUser();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/100 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-3xl font-bold text-[#800020] font-['The_Seasons',serif]">
              Maestro
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                  <Button
                    className="bg-[#800020] hover:bg-[#600010] text-white"
                    asChild
                  >
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
