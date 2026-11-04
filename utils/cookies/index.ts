import { isProduction } from "@/constants/env.constant";
import { SERVER_ENVIRONMENT } from "@/environments/server.environment";
import { jwtVerify, SignJWT } from "jose";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

const { AUTH_SECRET } = SERVER_ENVIRONMENT;

export class CookiesInstance {
  private key = "adm";

  private secret = new TextEncoder().encode(AUTH_SECRET);

  private cookieConfig: Partial<ResponseCookie> = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 604800,
  };

  async verifyAdminToken(token?: string): Promise<boolean> {
    if (!token) return false;

    try {
      const { payload } = await jwtVerify(token, this.secret, {
        algorithms: ["HS256"],
      });

      return payload.role === "admin";
    } catch {
      return false;
    }
  }

  async checkCookies(): Promise<boolean> {
    const cookieStore = await cookies();

    return this.verifyAdminToken(cookieStore.get(this.key)?.value);
  }

  async setCookies() {
    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(this.secret);

    (await cookies()).set(this.key, token, this.cookieConfig);
  }

  async deleteCookies() {
    (await cookies()).delete(this.key);
  }
}
