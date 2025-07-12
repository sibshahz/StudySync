import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

// Define protected routes and their required roles
const protectedRoutes: Record<string, string[]> = {
  "/dashboard": ["user", "moderator", "admin"],
  "/admin": ["admin"],
  "/moderator": ["moderator", "admin"],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route needs protection
  const requiredRoles = protectedRoutes[pathname]
  if (!requiredRoles) {
    return NextResponse.next()
  }

  // Get token from cookie or header
  const token = request.cookies.get("token")?.value || request.headers.get("authorization")?.replace("Bearer ", "")

  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url))
  }

  try {
    // Verify JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userRole = payload.role as string

    // Check if user has required role
    if (!requiredRoles.includes(userRole)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("JWT verification failed:", error)
    return NextResponse.redirect(new URL("/signin", request.url))
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/moderator/:path*"],
}
