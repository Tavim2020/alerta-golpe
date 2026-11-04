import { APP_ROUTE } from "@/routes/app.route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.redirect(
    new URL(APP_ROUTE.ADMIN.DASHBOARD.ROOT(), req.url),
  );
}
