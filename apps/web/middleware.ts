import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";
import { UserRole } from "@repo/database/enums";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_ISSUER = "study-sync";
const JWT_AUDIENCE = "study-sync-users";

const encoder = new TextEncoder();
const secret = encoder.encode(JWT_SECRET);

const protectedRoutes: Record<string, string[]> = {
  "/dashboard": [UserRole.ADMIN],
  "/dashboard/admin": [UserRole.ADMIN],
  "/admin": [UserRole.ADMIN],
  "/moderator": [UserRole.STAFF, UserRole.ADMIN],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`[MIDDLEWARE] Processing: ${pathname}`);

  // NEVER process these paths to prevent loops
  if (
    pathname === "/" ||
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/unauthorized" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".") // Skip files (favicon.ico, etc.)
  ) {
    console.log(`[MIDDLEWARE] Skipping: ${pathname}`);
    return NextResponse.next();
  }

  // Check if this path needs protection
  let matchedRoute: string | null = null;
  for (const route of Object.keys(protectedRoutes)) {
    if (pathname === route || pathname.startsWith(route + "/")) {
      matchedRoute = route;
      break;
    }
  }

  // If not a protected route, allow access
  if (!matchedRoute) {
    console.log(`[MIDDLEWARE] Not protected: ${pathname}`);
    return NextResponse.next();
  }

  console.log(
    `[MIDDLEWARE] Protected route: ${pathname} (matched: ${matchedRoute})`,
  );

  // Get token from cookie
  const token = request.cookies.get("token")?.value;

  if (!token) {
    console.log(`[MIDDLEWARE] No token for: ${pathname}`);
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(signInUrl);
  }

  try {
    // Verify JWT
    const { payload }: { payload: JWTPayload } = await jwtVerify(
      token,
      secret,
      {
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      },
    );

    // Check roles
    const requiredRoles = protectedRoutes[matchedRoute];
    const userRoles: string[] = Array.isArray(payload.role)
      ? payload.role
      : payload.role
        ? [payload.role]
        : [];

    const hasAccess = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasAccess) {
      console.log(
        `[MIDDLEWARE] Access denied: need ${requiredRoles}, have ${userRoles}`,
      );
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    console.log(`[MIDDLEWARE] ✅ Access granted: ${pathname}`);
    return NextResponse.next();
  } catch (error) {
    console.error(`[MIDDLEWARE] JWT error:`, error);
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("redirectTo", pathname);
    signInUrl.searchParams.set("reason", "invalid_token");
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  // Very specific matcher - only protected routes
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/admin",
    "/admin/:path*",
    "/moderator",
    "/moderator/:path*",
  ],
};
