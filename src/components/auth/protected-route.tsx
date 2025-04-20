"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not loading and no user is found, redirect to signin
    if (!isLoading && !user) {
      // Store the current path to redirect back after login
      const returnUrl = encodeURIComponent(pathname);
      router.push(`/signin?returnUrl=${returnUrl}`);
    }
  }, [user, isLoading, router, pathname]);

  // Show loading or nothing while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If we have a user, render the children
  return user ? <>{children}</> : null;
}
