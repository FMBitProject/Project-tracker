import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    // JURUS ANTI-IDX: Cek cookie standar DAN cookie HTTPS (__Secure-)
    const sessionToken = 
        request.cookies.get("better-auth.session_token")?.value || 
        request.cookies.get("__Secure-better-auth.session_token")?.value;

    const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
    const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

    // 1. Jika sudah ada token (sudah login), jangan boleh ke halaman Login/Signup
    if (isAuthPage && sessionToken) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 2. Jika mau ke Dashboard tapi TIDAK ada token, tendang ke Login
    if (isDashboardPage && !sessionToken) {
        const url = new URL("/auth/signin", request.url);
        url.searchParams.set("callbackUrl", request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// Jalankan satpam ini HANYA di halaman dashboard dan auth
export const config = {
    matcher: ["/dashboard/:path*", "/auth/:path*"],
};