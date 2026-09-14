import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Route-protects /admin/**. This is a fast, optimistic gate only — every
// Server Action under /admin re-checks the session itself (see
// requireAdmin() in src/lib/session.ts), since proxy can be bypassed by
// calling a Server Action directly.
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  if (!req.auth && !isLoginPage) {
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (req.auth && isLoginPage) {
    return NextResponse.redirect(new URL("/admin/products", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
