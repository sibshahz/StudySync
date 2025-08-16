import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";
import { UserRole } from "@repo/database/enums";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_ISSUER = "study-sync";
const JWT_AUDIENCE = "study-sync-users";

const encoder = new TextEncoder();
const secret = encoder.encode(JWT_SECRET);

// Define protected routes with more specific matching
const protectedRoutes: Record<string, string[]> = {
  "/dashboard/admin": [UserRole.ADMIN], // More specific routes first
  "/dashboard": [UserRole.ADMIN],
  "/moderator": [UserRole.STAFF, UserRole.ADMIN],
  "/admin": [UserRole.ADMIN], // Added to match your config
};

// Routes that should be accessible to authenticated users regardless of role
const authRequiredRoutes = [
  "/profile",
  "/settings",
  // Add other routes that just need authentication
];

// Public routes that should never be protected
const publicRoutes = [
  "/",
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/about",
  "/contact",
  "/api/auth", // Allow auth endpoints
];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function isAuthRequiredRoute(pathname: string): boolean {
  return authRequiredRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function findMatchedProtectedRoute(pathname: string): string | null {
  // Sort routes by specificity (longer routes first) to match more specific routes
  const sortedRoutes = Object.keys(protectedRoutes).sort(
    (a, b) => b.length - a.length,
  );

  return sortedRoutes.find((route) => pathname.startsWith(route)) || null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Get token from multiple sources
  const cookieToken = request.cookies.get("token")?.value;
  const authHeader = request.headers.get("authorization");
  const headerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined;

  const token = cookieToken || headerToken;

  // Check if route requires authentication
  const matchedRoute = findMatchedProtectedRoute(pathname);
  const requiresAuth = matchedRoute || isAuthRequiredRoute(pathname);

  if (!token && requiresAuth) {
    console.warn(
      `[AUTH MIDDLEWARE] ❌ No token found for protected route: ${pathname}`,
    );

    // Store the original URL to redirect back after login
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("redirectTo", pathname);

    return NextResponse.redirect(signInUrl);
  }

  // If no authentication required, continue
  if (!requiresAuth) {
    return NextResponse.next();
  }

  try {
    // Verify token
    const { payload }: { payload: JWTPayload } = await jwtVerify(
      token!,
      secret,
      {
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      },
    );

    // Check token expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      console.warn("[AUTH MIDDLEWARE] ❌ Token expired");
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("redirectTo", pathname);
      signInUrl.searchParams.set("expired", "true");
      return NextResponse.redirect(signInUrl);
    }

    // If route only requires authentication (not specific roles), allow access
    if (isAuthRequiredRoute(pathname) && !matchedRoute) {
      console.log(
        `[AUTH MIDDLEWARE] ✅ Authenticated user accessing: ${pathname}`,
      );
      return NextResponse.next();
    }

    // Handle role-based authorization for protected routes
    if (matchedRoute) {
      const requiredRoles = protectedRoutes[matchedRoute];

      // Normalize roles - handle both string and array formats
      const userRoles: string[] = Array.isArray(payload.role)
        ? payload.role
        : payload.role
          ? [payload.role]
          : [];

      console.log("[AUTH MIDDLEWARE] ✅ Verified user:", {
        sub: payload.sub,
        email: payload.email,
        roles: userRoles,
        route: matchedRoute,
        requiredRoles,
      });

      // Role check
      const hasAccess = requiredRoles.some((requiredRole) =>
        userRoles.includes(requiredRole),
      );

      if (!hasAccess) {
        console.warn("[AUTH MIDDLEWARE] ❌ Insufficient permissions", {
          requiredRoles,
          userRoles,
          route: matchedRoute,
        });
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    // Add user info to request headers for downstream use
    const response = NextResponse.next();
    response.headers.set("x-user-id", payload.sub || "");
    response.headers.set("x-user-email", (payload.email as string) || "");
    response.headers.set("x-user-roles", JSON.stringify(payload.role || []));

    return response;
  } catch (err) {
    console.error("[AUTH MIDDLEWARE] ❌ JWT verification failed:", {
      error: err instanceof Error ? err.message : "Unknown error",
      pathname,
      hasToken: !!token,
    });

    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("redirectTo", pathname);
    signInUrl.searchParams.set("error", "invalid_token");

    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  // More comprehensive matcher that excludes static files and API routes
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
