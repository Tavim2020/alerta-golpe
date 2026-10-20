import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { handlerMiddleware, Middleware } from "../utils/middleware";
import { validateRequestData } from "../utils/validators";
import { adminLoginSchema } from "@/app/admin/login/schemas/admin-login.schema";
import { SERVER_ENVIRONMENT } from "@/environments/server.environment";
import { CookiesInstance } from "@/utils/cookies";

const { ADMIN_EMAIL, ADMIN_PASSWORD } = SERVER_ENVIRONMENT;

const same = (candidate: string, expected = ""): boolean =>
  candidate.length === expected.length &&
  timingSafeEqual(Buffer.from(candidate), Buffer.from(expected));

const login: Middleware = async (req) => {
  const body = await validateRequestData({
    schema: adminLoginSchema,
    req,
  });

  if (!same(body.email, ADMIN_EMAIL) || !same(body.password, ADMIN_PASSWORD)) {
    return NextResponse.json(
      { error: "E-mail ou senha incorretos" },
      { status: 401 },
    );
  }

  await new CookiesInstance().setCookies();

  return NextResponse.json({ message: "Login efetuado com sucesso!" });
};

export async function POST(req: NextRequest) {
  return await handlerMiddleware(login)(req);
}
