"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/auth/client"; // Pastikan path ini benar (biasanya @/lib/auth-client atau @/auth/client)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function SignInForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const registered = searchParams.get("registered") === "true";
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Tampilkan pesan sukses jika user baru saja mendaftar
    if (registered && !success) {
        setSuccess("Account created successfully! Please sign in.");
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            // Melakukan proses login
            const result = await signIn.email({
                email,
                password,
            });

            console.log("[SignIn] Result:", result);

            if (result?.error) {
                setError(result.error.message || "Sign in failed");
                setIsLoading(false);
                return;
            }

            // JURUS PAMUNGKAS: Hard Redirect
            // Menggunakan window.location.href memaksa browser memuat ulang halaman secara total.
            // Ini memastikan Cookie sesi tersimpan dengan benar sebelum masuk Dashboard.
            if (result?.data) {
                console.log("[SignIn] Success — Redirecting to:", callbackUrl);
                window.location.href = callbackUrl; 
            }

        } catch (err) {
            console.error("[SignIn] Caught exception:", err);
            setError("An unexpected error occurred");
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
                {error && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-md">
                        {success}
                    </div>
                )}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        disabled={isLoading}
                        // autoComplete dihapus untuk mencegah Hydration Error (layar merah)
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        disabled={isLoading}
                        // autoComplete dihapus untuk mencegah Hydration Error (layar merah)
                    />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/signup" className="text-primary hover:underline">
                        Sign up
                    </Link>
                </p>
            </CardFooter>
        </form>
    );
}

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                    <CardDescription>
                        Enter your email and password to access your account
                    </CardDescription>
                </CardHeader>
                <Suspense fallback={<div className="p-6 text-center">Loading form...</div>}>
                    <SignInForm />
                </Suspense>
            </Card>
        </div>
    );
}