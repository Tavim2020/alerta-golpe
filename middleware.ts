import { jwtVerify } from 'jose';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let ok = false;
  const token = req.cookies.get('adm')?.value;
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
  if (!ok && pathname.startsWith('/api')) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  if (!ok && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/acesso-adm', req.url));
  }
  const res = NextResponse.next();
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*', '/acesso-adm'] };
