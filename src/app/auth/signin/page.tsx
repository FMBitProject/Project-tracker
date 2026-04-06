"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

function SignInForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const registered = searchParams.get("registered") === "true";

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

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
            const result = await signIn.email({ email, password });

            if (result?.error) {
                setError(result.error.message || "Sign in failed");
                setIsLoading(false);
                return;
            }

            if (result?.data) {
                window.location.href = callbackUrl;
            }
        } catch (err) {
            setError("An unexpected error occurred");
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-5">
                {error && (
                    <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl">
                        {success}
                    </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                        Email Address
                    </Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            disabled={isLoading}
                            className="pl-10 h-11 border-slate-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl"
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                            Password
                        </Label>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            required
                            disabled={isLoading}
                            className="pl-10 h-11 border-slate-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl"
                        />
                    </div>
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all rounded-xl"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Signing in...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            Sign In
                            <ArrowRight className="h-4 w-4" />
                        </span>
                    )}
                </Button>
            </div>
        </form>
    );
}

export default function SignInPage() {
    return (
        <div className="min-h-screen flex relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700" />

            {/* Decorative floating circles */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
            <div className="absolute -top-20 right-1/4 w-48 h-48 bg-pink-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />

            {/* Floating geometric shapes */}
            <div className="absolute top-20 right-20 opacity-20">
                <Sparkles className="h-12 w-12 text-white animate-spin" style={{ animationDuration: "8s" }} />
            </div>
            <div className="absolute bottom-32 left-20 opacity-15">
                <Sparkles className="h-8 w-8 text-white animate-spin" style={{ animationDuration: "12s" }} />
            </div>

            {/* Left panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative z-10 items-center justify-center p-12">
                <div className="max-w-md text-white">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight">Project Tracker</span>
                    </div>
                    <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
                        Welcome back!
                    </h1>
                    <p className="text-lg text-white/80 mt-4 leading-relaxed">
                        Pick up where you left off. Track your projects, manage tasks, and stay on top of your deadlines.
                    </p>

                    {/* Feature bullets */}
                    <div className="mt-10 space-y-4">
                        {[
                            { emoji: "📊", text: "Real-time project dashboards" },
                            { emoji: "⚡", text: "Task tracking with priorities" },
                            { emoji: "📅", text: "Visual timeline planning" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                                <span className="text-2xl">{item.emoji}</span>
                                <span className="text-sm font-medium">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right panel - Sign in form */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl border-0 rounded-3xl overflow-hidden">
                    {/* Gradient top bar */}
                    <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />

                    <div className="p-8">
                        {/* Mobile logo */}
                        <div className="flex items-center gap-3 mb-6 lg:hidden">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-md">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-extrabold text-slate-800">Project Tracker</span>
                        </div>

                        {/* Header */}
                        <div className="mb-8">
                            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                Sign In
                            </h2>
                            <p className="text-sm text-slate-500 mt-2">
                                Enter your credentials to access your account
                            </p>
                        </div>

                        <Suspense fallback={<div className="p-6 text-center">Loading form...</div>}>
                            <SignInForm />
                        </Suspense>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <p className="text-sm text-center text-slate-500">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/auth/signup"
                                    className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors"
                                >
                                    Create one now →
                                </Link>
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
