import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
    const isApiAuth = request.nextUrl.pathname.startsWith("/api/auth");

    // Allow public access to auth pages and auth API
    if (isAuthPage || isApiAuth) {
        return NextResponse.next();
    }

    // Redirect to sign in if not authenticated
    if (!session) {
        const url = new URL("/auth/signin", request.url);
        url.searchParams.set("callbackUrl", request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
