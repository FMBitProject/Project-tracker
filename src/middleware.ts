import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    // Kita cek cookie session secara manual (nama default better-auth)
    // Ini cara paling ringan & nggak akan bikin error "Build Error"
    const sessionToken = request.cookies.get("better-auth.session_token")?.value;

    const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
    const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

    // 1. Kalau sudah login (ada token), jangan biarkan masuk ke halaman login/signup
    if (isAuthPage && sessionToken) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 2. Kalau mau masuk dashboard tapi TIDAK ada token, tendang ke sign-in
    if (isDashboardPage && !sessionToken) {
        const url = new URL("/auth/signin", request.url);
        url.searchParams.set("callbackUrl", request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// Hanya jalankan middleware di rute ini agar tidak lemot
export const config = {
    matcher: ["/dashboard/:path*", "/auth/:path*"],
};