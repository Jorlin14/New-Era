import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// PARSE JWT (client-side only, real verification happens in backend)
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  // PROTECT DASHBOARD ROUTES
  if (path.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    const payload = parseJwt(token);

    if (!payload || !payload.role) {
      request.cookies.delete('token');
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    const role = payload.role.toLowerCase();
    const intendedDashboardPath = `/dashboard/${role}`;

    // ENFORCE ROLE-BASED ACCESS
    if (!path.startsWith(intendedDashboardPath)) {
      return NextResponse.redirect(new URL(intendedDashboardPath, request.url));
    }
  }

  // REDIRECT AUTHENTICATED USERS AWAY FROM AUTH
  if (path.startsWith('/auth') && token) {
    const payload = parseJwt(token);
    if (payload && payload.role) {
      if (payload.role === 'CUSTOMER') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      const role = payload.role.toLowerCase();
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
