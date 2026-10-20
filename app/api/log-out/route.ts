import { NextResponse, type NextRequest } from "next/server";
import { handlerMiddleware, Middleware } from "../utils/middleware";
import { CookiesInstance } from "@/utils/cookies";
import { APP_ROUTE } from "@/routes/app.route";

const cleanupCookies: Middleware = async (req) => {
  await new CookiesInstance().deleteCookies();

  return NextResponse.redirect(new URL(APP_ROUTE.ADMIN.LOGIN, req.url));
};

export async function GET(req: NextRequest) {
  return await handlerMiddleware(cleanupCookies)(req);
}
