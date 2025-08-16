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
  "/moderator": [UserRole.STAFF, UserRole.ADMIN],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🔍 Match route
  const matchedRoute = Object.keys(protectedRoutes).find((route) =>
    pathname.startsWith(route),
  );

  if (!matchedRoute) return NextResponse.next();

  const requiredRoles = protectedRoutes[matchedRoute];

  // 🔍 Grab token from cookie or header
  const cookieToken = request.cookies.get("token")?.value;
  const authHeader = request.headers.get("authorization");
  const headerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined;

  const token = cookieToken || headerToken;

  if (!token) {
    console.warn("[AUTH MIDDLEWARE] ❌ Token not found");
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  try {
    const { payload }: { payload: JWTPayload } = await jwtVerify(
      token,
      secret,
      {
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      },
    );

    // 🔍 Normalize role(s) to an array
    const userRoles = Array.isArray(payload.role)
      ? payload.role
      : payload.role
        ? [payload.role]
        : [];

    console.log("[AUTH MIDDLEWARE] ✅ Verified user:", {
      sub: payload.sub,
      roles: userRoles,
    });

    // 🔍 Check access
    const hasAccess = requiredRoles.some((r) => userRoles.includes(r));
    if (!hasAccess) {
      console.warn("[AUTH MIDDLEWARE] ❌ Role not allowed", {
        requiredRoles,
        userRoles,
      });
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("[AUTH MIDDLEWARE] ❌ JWT verification failed:", err);
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/moderator/:path*"],
};
