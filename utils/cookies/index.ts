import { SERVER_ENVIRONMENT } from "@/environments/server.environment";
import { SignJWT } from "jose";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

const { AUTH_SECRET } = SERVER_ENVIRONMENT;

export class CookiesInstance {
  private key = "adm";

  private cookieConfig: Partial<ResponseCookie> = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 604800,
  };

  async setCookies() {
    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(AUTH_SECRET));

    (await cookies()).set(this.key, token, this.cookieConfig);
  }

  async deleteCookies() {
    (await cookies()).delete(this.key);
  }
}
