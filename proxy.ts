import { NextResponse, type NextRequest } from "next/server";
import { APP_ROUTE } from "./routes/app.route";
import { CookiesInstance } from "./utils/cookies";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdmin = await new CookiesInstance().checkCookies();

  if (pathname.startsWith("/api") && !isAdmin) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (pathname.startsWith("/admin/") && !isAdmin) {
    return NextResponse.redirect(new URL(APP_ROUTE.LOGIN.ROOT, req.url));
  }

  const response = NextResponse.next();

  response.headers.set("X-Robots-Tag", "noindex, nofollow");

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
