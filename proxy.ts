import { NextResponse, type NextRequest } from "next/server";
import { APP_ROUTE } from "./routes/app.route";
import { CookiesInstance } from "./utils/cookies";

export async function proxy(req: NextRequest) {
  const checkCheck = await new CookiesInstance().checkCookies();

  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/api") && !checkCheck)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  if (pathname.startsWith("/admin") && !checkCheck)
    return NextResponse.redirect(new URL(APP_ROUTE.LOGIN.ROOT, req.url));

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
