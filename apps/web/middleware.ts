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

  const matchedRoute = Object.keys(protectedRoutes).find((route) =>
    pathname.startsWith(route)
  );

  if (!matchedRoute) return NextResponse.next();

  const requiredRoles = protectedRoutes[matchedRoute];

  const cookieToken = request.cookies.get("token")?.value;
  const authHeader = request.headers.get("authorization");
  const headerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined;

  const token = cookieToken || headerToken;

  if (!token) {
    console.log("*** TOKEN NOT FOUND: ", token)
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  try {
    const { payload }: { payload: JWTPayload } = await jwtVerify(token, secret, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });

    const userRole = payload.role as string;

    if (!requiredRoles?.includes(userRole)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/moderator/:path*"],
};
