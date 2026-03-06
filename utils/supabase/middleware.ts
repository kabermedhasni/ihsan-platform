import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Do not write any logic between createServerClient and getUser()
  let user = null;
  try {
    const {
      data: { user: foundUser },
    } = await supabase.auth.getUser();
    user = foundUser;
  } catch (err) {
    console.error("Middleware auth error:", err);
  }

  const { pathname } = request.nextUrl;
  const isAuthPage = pathname.startsWith("/auth");
  const isApiRoute = pathname.startsWith("/api");

  // Public API routes for landing page
  const publicApiRoutes = [
    "/api/donations/recent",
    "/api/needs/funding",
    "/api/stats/global",
    "/api/transparency/ledger",
  ];
  const isPublicApi = publicApiRoutes.includes(pathname);

  // Not logged in and trying to access a protected page
  // Whitelist "/", "/auth", and specific public API routes
  const isPublicPage =
    pathname === "/" ||
    pathname === "/transparency" ||
    isAuthPage ||
    isPublicApi;

  if (!user && !isPublicPage) {
    if (isApiRoute) {
      // Return 401 instead of redirecting for API routes to avoid JSON parse errors
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Logged in and trying to visit /auth → redirect to dashboard
  // UNLESS they are resetting their password
  if (user && isAuthPage) {
    if (request.nextUrl.searchParams.get("view") === "new-password") {
      return supabaseResponse;
    }
    const role = (user.user_metadata?.role || "").toLowerCase();
    const url = request.nextUrl.clone();
    url.pathname = role ? `/${role}` : "/auth";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Role-based access control
  // TEMPORARILy DISABLED FOR TESTING so the user can freely access any dashboard
  /*
  const protectedRoutes = ["/validator", "/donor", "/partner"];
  const currentProtectedRoute = protectedRoutes.find(route => pathname.startsWith(route));

  if (user && currentProtectedRoute) {
    const role = (user.user_metadata?.role || "").toLowerCase();
    const requiredRole = currentProtectedRoute.substring(1); // e.g., "validator"

    if (role !== requiredRole && role) {
      // User has the wrong role for this page → redirect to their own dashboard
      const url = request.nextUrl.clone();
      url.pathname = `/${role}`;
      url.search = "";
      return NextResponse.redirect(url);
    }
  }
  */

  return supabaseResponse;
}
