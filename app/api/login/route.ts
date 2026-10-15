import { timingSafeEqual } from 'node:crypto';
import { SignJWT } from 'jose';
import { NextResponse, type NextRequest } from 'next/server';

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

const same = (candidate: string, expected = ''): boolean =>
  !!expected && candidate.length === expected.length && timingSafeEqual(Buffer.from(candidate), Buffer.from(expected));

export async function POST(req: NextRequest) {
  const body = (await req.json()) as LoginBody;
  const email = typeof body.email === 'string' ? body.email : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!same(email, process.env.ADMIN_EMAIL) || !same(password, process.env.ADMIN_PASSWORD)) {
    return NextResponse.json({ error: 'E-mail ou senha incorretos' }, { status: 401 });
  }

  const authSecret = process.env.AUTH_SECRET;
  if (!authSecret) {
    throw new Error('AUTH_SECRET deve estar configurada.');
  }

  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(authSecret));
  const response = NextResponse.json({ ok: true });
  response.cookies.set('adm', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 604800,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete('adm');
  return response;
}
