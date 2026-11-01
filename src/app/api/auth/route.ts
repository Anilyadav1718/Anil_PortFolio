import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();
    const serverPasscode = process.env.ADMIN_PASSCODE || 'admin2026';

    if (!passcode || passcode !== serverPasscode) {
      return NextResponse.json(
        { error: 'Access Denied: Invalid Passcode / Authentication Token.' },
        { status: 401 }
      );
    }

    const isHttps = req.headers.get('x-forwarded-proto') === 'https' || req.nextUrl.protocol === 'https:';
    const token = 'authenticated_token_' + Date.now();

    const response = NextResponse.json({
      success: true,
      message: 'Access Granted: Administrative Session Initialized.',
      token,
    });

    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Authentication error.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get('admin_session');
  const headerToken =
    req.headers.get('authorization')?.replace('Bearer ', '') ||
    req.headers.get('x-admin-token');
  const serverPasscode = process.env.ADMIN_PASSCODE || 'admin2026';

  const isAuth =
    (cookie && cookie.value.startsWith('authenticated_token_')) ||
    (headerToken && (headerToken.startsWith('authenticated_token_') || headerToken === serverPasscode));

  if (!isAuth) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Administrative Session Terminated.' });
  response.cookies.delete('admin_session');
  return response;
}

