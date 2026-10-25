import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

// First line of defence for /admin. Pages and server actions re-check the session.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  const isLogin = pathname === "/admin/login";

  let response: NextResponse;
  if (!authed && !isLogin) response = NextResponse.redirect(new URL("/admin/login", request.url));
  else if (authed && isLogin) response = NextResponse.redirect(new URL("/admin", request.url));
  else response = NextResponse.next();

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
