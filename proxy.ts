import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";
import { APP_ROUTE } from "./routes/app.route";

export async function proxy(req: NextRequest) {
  let ok = false;
  const token = req.cookies.get("adm")?.value;
  const secret = process.env.AUTH_SECRET;

  if (token && secret) {
    try {
      await jwtVerify(token, new TextEncoder().encode(secret));
      ok = true;
    } catch {
      ok = false;
    }
  }

  const { pathname } = req.nextUrl;
  if (!ok && pathname.startsWith("/api"))
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  if (!ok && pathname === APP_ROUTE.ADMIN.DASHBOARD.ROOT)
    return NextResponse.redirect(new URL(APP_ROUTE.LOGIN.ROOT, req.url));

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
