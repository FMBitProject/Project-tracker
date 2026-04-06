"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function SignInForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const registered = searchParams.get("registered") === "true";
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Show success message if user just registered
    if (registered && !success) {
        setSuccess("Account created successfully! Please sign in.");
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        // Block ALL default form behavior immediately
        e.preventDefault();
        e.stopPropagation();

        if (isLoading) return;

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const result = await signIn.email({
                email,
                password,
                callbackURL: callbackUrl,
            });

            console.log("[SignIn] Result:", result);

            if (result?.error) {
                setError(result.error.message || "Sign in failed");
                setIsLoading(false);
                return;
            }

            if (!result?.data) {
                setError("Sign in returned no data");
                setIsLoading(false);
                return;
            }

            console.log("[SignIn] Success — redirecting to:", callbackUrl);

            // Use Next.js router for client-side navigation
            router.push(callbackUrl);
            router.refresh();
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
                        autoComplete="email"
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
                        autoComplete="current-password"
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
                <Suspense fallback={<div className="p-6">Loading...</div>}>
                    <SignInForm />
                </Suspense>
            </Card>
        </div>
    );
}
