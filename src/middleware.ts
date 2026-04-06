import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth";

export async function middleware(request: NextRequest) {
    // 1. Cek cookie sesi secara ringan (tanpa lapor ke database dulu)
    const sessionCookie = getSessionCookie(request); 

    const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
    const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

    // 2. Kalau sudah login, jangan boleh ke halaman login/signup lagi
    if (isAuthPage && sessionCookie) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 3. Kalau mau ke dashboard tapi BELUM login, tendang ke signin
    if (isDashboardPage && !sessionCookie) {
        const url = new URL("/auth/signin", request.url);
        url.searchParams.set("callbackUrl", request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// 4. Batasi matcher agar middleware HANYA jalan di rute yang penting saja
export const config = {
    matcher: ["/dashboard/:path*", "/auth/:path*"],
};