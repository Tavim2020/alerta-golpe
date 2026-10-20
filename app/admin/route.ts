import { APP_ROUTE } from "@/routes/app.route";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect(APP_ROUTE.HOME.ROOT);
}
