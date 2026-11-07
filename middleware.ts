import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Strict Server-Side Access Control for /admin
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const adminSession = request.cookies.get("admin_session")?.value;
    const userRole = request.cookies.get("user_role")?.value;

    if (adminSession !== "true" && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/profile?need_admin=true", request.url));
    }
    return NextResponse.next();
  }

  // 2. Protect Data Pulls Web Pages (Redirect to UI login page)
  if (pathname === "/data-pulls" || pathname.startsWith("/data-pulls/")) {
    const adminSession = request.cookies.get("admin_session")?.value;
    const userRole = request.cookies.get("user_role")?.value;
    if (adminSession !== "true" && userRole !== "ADMIN") {
      const loginUrl = new URL("/admin-login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 3. Protect API Routes (Return 401 JSON without WWW-Authenticate header to prevent browser popups)
  if (pathname.startsWith("/api/ingest") || pathname.startsWith("/api/export")) {
    const adminSession = request.cookies.get("admin_session")?.value;
    const userRole = request.cookies.get("user_role")?.value;
    if (adminSession === "true" || userRole === "ADMIN") {
      return NextResponse.next();
    }

    const expectedUser = process.env.ADMIN_BASIC_USER || "creativelab.co.th@gmail.com";
    const expectedPassword = process.env.ADMIN_BASIC_PASSWORD || "I@M_Cr3LabTH_F4M";

    const header = request.headers.get("authorization");
    if (header?.startsWith("Basic ")) {
      try {
        const [user, password] = atob(header.slice("Basic ".length)).split(":");
        if (user === expectedUser && password === expectedPassword) {
          return NextResponse.next();
        }
      } catch {
        // Fall through to 401
      }
    }

    return new NextResponse(JSON.stringify({ error: "Unauthorized. Admin credentials required." }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/data-pulls/:path*", "/api/ingest/:path*", "/api/export"]
};
