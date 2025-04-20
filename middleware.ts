import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Create a response to modify
  const res = NextResponse.next();

  // Create a Supabase client using the Server Component helper
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove: (name, options) => {
          res.cookies.delete({
            name,
            ...options,
          });
        },
      },
    }
  );

  // Get the session from Supabase
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if the request is for a dashboard route
  const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard");

  // If accessing dashboard routes without a session, redirect to signin
  if (isDashboardRoute && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/signin";
    // Pass the original URL as a query parameter so we can redirect after login
    redirectUrl.searchParams.set("returnUrl", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  // Only run middleware on dashboard routes
  matcher: ["/dashboard/:path*"],
};
