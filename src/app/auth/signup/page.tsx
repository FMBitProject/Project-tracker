"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function SignUpPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // Validate password length
        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            setIsLoading(false);
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }

        // Validate name length
        if (name.length < 2) {
            setError("Name must be at least 2 characters long");
            setIsLoading(false);
            return;
        }

        try {
            console.log("Signing up with:", { email, name });
            
            const result = await signUp.email({
                email,
                password,
                name,
            });

            console.log("Sign up result:", result);

            if (result.error) {
                console.error("Sign up error:", result.error);
                setError(result.error.message || "Sign up failed. Please try again.");
            } else {
                console.log("Sign up successful, redirecting to signin");
                setSuccess("Account created successfully! Redirecting to sign in...");

                // Use window.location.href for a full page reload to ensure
                // the new session cookies are recognized by the middleware
                setTimeout(() => {
                    window.location.href = "/auth/signin?registered=true";
                }, 1000);
            }
        } catch (err) {
            console.error("Unexpected error during sign up:", err);
            setError("An unexpected error occurred. Please check your connection and try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                    <CardDescription>
                        Enter your details to create a new account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <div>
                                    <strong>Error:</strong> {error}
                                </div>
                            </div>
                        )}
                        
                        {success && (
                            <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800 flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <div>
                                    {success}
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                required
                                disabled={isLoading}
                                minLength={2}
                                autoComplete="name"
                            />
                        </div>
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
                                minLength={8}
                                autoComplete="new-password"
                            />
                            <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                        <p className="text-sm text-center text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/auth/signin" className="text-primary hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
