import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";
import { UserRole } from "@repo/database/enums";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_ISSUER = "study-sync";
const JWT_AUDIENCE = "study-sync-users";

const encoder = new TextEncoder();
const secret = encoder.encode(JWT_SECRET);

// Define protected routes with their required roles
const protectedRoutes: Record<string, string[]> = {
  "/dashboard/admin": [UserRole.ADMIN],
  "/dashboard": [UserRole.ADMIN],
  "/moderator": [UserRole.STAFF, UserRole.ADMIN],
  "/admin": [UserRole.ADMIN],
};

// Define public routes that should NEVER trigger middleware
const publicRoutes = [
  "/",
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/about",
  "/contact",
  "/unauthorized", // Important: prevent redirect loops
];

// Define auth API routes that should be excluded
const authApiRoutes = ["/api/auth"];

// Static file patterns to exclude
const staticFilePatterns = [
  "/_next",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/.well-known",
];

function shouldSkipMiddleware(pathname: string): boolean {
  // Skip exact public routes
  if (publicRoutes.includes(pathname)) {
    return true;
  }

  // Skip auth API routes
  if (authApiRoutes.some((route) => pathname.startsWith(route))) {
    return true;
  }

  // Skip static files
  if (staticFilePatterns.some((pattern) => pathname.startsWith(pattern))) {
    return true;
  }

  // Skip files with extensions (images, css, js, etc.)
  if (/\.[^/]+$/.test(pathname)) {
    return true;
  }

  return false;
}

function findProtectedRoute(pathname: string): string | null {
  // Sort by length (longest first) to match most specific route
  const sortedRoutes = Object.keys(protectedRoutes).sort(
    (a, b) => b.length - a.length,
  );
  return sortedRoutes.find((route) => pathname.startsWith(route)) || null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Early exit for routes that should never be processed
  if (shouldSkipMiddleware(pathname)) {
    return NextResponse.next();
  }

  // Check if this is a protected route
  const matchedRoute = findProtectedRoute(pathname);

  // If not a protected route, allow access
  if (!matchedRoute) {
    return NextResponse.next();
  }

  // Get token from cookie or header
  const cookieToken = request.cookies.get("token")?.value;
  const authHeader = request.headers.get("authorization");
  const headerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined;

  const token = cookieToken || headerToken;

  // If no token found, redirect to signin
  if (!token) {
    console.log(`[AUTH MIDDLEWARE] No token for protected route: ${pathname}`);

    // Create signin URL with redirect parameter
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("redirectTo", pathname);

    return NextResponse.redirect(signInUrl);
  }

  try {
    // Verify the JWT token
    const { payload }: { payload: JWTPayload } = await jwtVerify(
      token,
      secret,
      {
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      },
    );

    // Check if token is expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      console.log(`[AUTH MIDDLEWARE] Token expired for: ${pathname}`);

      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("redirectTo", pathname);
      signInUrl.searchParams.set("reason", "expired");

      return NextResponse.redirect(signInUrl);
    }

    // Get required roles for the matched route
    const requiredRoles = protectedRoutes[matchedRoute];

    // Normalize user roles
    const userRoles: string[] = Array.isArray(payload.role)
      ? payload.role
      : payload.role
        ? [payload.role]
        : [];

    console.log(`[AUTH MIDDLEWARE] User access check:`, {
      route: matchedRoute,
      requiredRoles,
      userRoles,
      userId: payload.sub,
    });

    // Check if user has required role
    const hasAccess = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasAccess) {
      console.log(`[AUTH MIDDLEWARE] Access denied for: ${pathname}`);
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Access granted - add user info to headers for downstream use
    const response = NextResponse.next();
    response.headers.set("x-user-id", payload.sub || "");
    response.headers.set("x-user-roles", JSON.stringify(userRoles));

    console.log(`[AUTH MIDDLEWARE] Access granted for: ${pathname}`);
    return response;
  } catch (error) {
    console.error(`[AUTH MIDDLEWARE] JWT verification failed:`, {
      error: error instanceof Error ? error.message : "Unknown error",
      pathname,
    });

    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("redirectTo", pathname);
    signInUrl.searchParams.set("reason", "invalid");

    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  // Only match the specific protected routes to avoid unnecessary middleware execution
  matcher: ["/dashboard/:path*", "/admin/:path*", "/moderator/:path*"],
};
