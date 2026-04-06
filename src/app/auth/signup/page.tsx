"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
    Mail,
    Lock,
    User,
    ArrowRight,
    Sparkles,
    AlertCircle,
    CheckCircle2,
    Eye,
    EyeOff,
} from "lucide-react";

export default function SignUpPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            setIsLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }

        if (name.length < 2) {
            setError("Name must be at least 2 characters long");
            setIsLoading(false);
            return;
        }

        try {
            const result = await signUp.email({ email, password, name });

            if (result.error) {
                setError(result.error.message || "Sign up failed. Please try again.");
            } else {
                setSuccess("Account created successfully! Redirecting to sign in...");
                setTimeout(() => {
                    window.location.href = "/auth/signin?registered=true";
                }, 1000);
            }
        } catch (err) {
            setError("An unexpected error occurred. Please check your connection and try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700" />

            {/* Decorative floating circles */}
            <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
            <div className="absolute -bottom-20 left-1/4 w-48 h-48 bg-lime-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />

            {/* Floating geometric shapes */}
            <div className="absolute top-20 left-20 opacity-20">
                <Sparkles className="h-12 w-12 text-white animate-spin" style={{ animationDuration: "8s" }} />
            </div>
            <div className="absolute bottom-32 right-20 opacity-15">
                <Sparkles className="h-8 w-8 text-white animate-spin" style={{ animationDuration: "12s" }} />
            </div>

            {/* Left panel - Sign up form */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl border-0 rounded-3xl overflow-hidden">
                    {/* Gradient top bar */}
                    <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

                    <div className="p-8">
                        {/* Mobile logo */}
                        <div className="flex items-center gap-3 mb-6 lg:hidden">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 shadow-md">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-extrabold text-slate-800">Project Tracker</span>
                        </div>

                        {/* Header */}
                        <div className="mb-8">
                            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                                Create Account
                            </h2>
                            <p className="text-sm text-slate-500 mt-2">
                                Start tracking your projects today
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-5">
                                {error && (
                                    <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong>Error:</strong> {error}
                                        </div>
                                    </div>
                                )}

                                {success && (
                                    <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        <div>{success}</div>
                                    </div>
                                )}

                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="John Doe"
                                            required
                                            disabled={isLoading}
                                            minLength={2}
                                            autoComplete="name"
                                            className="pl-10 h-11 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400 rounded-xl"
                                        />
                                    </div>
                                </div>

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
                                            autoComplete="email"
                                            className="pl-10 h-11 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400 rounded-xl"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Minimum 8 characters"
                                            required
                                            disabled={isLoading}
                                            minLength={8}
                                            autoComplete="new-password"
                                            className="pl-10 pr-10 h-11 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400 rounded-xl"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-400">Minimum 8 characters</p>
                                </div>

                                {/* Submit */}
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-11 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all rounded-xl"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Creating account...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Create Account
                                            <ArrowRight className="h-4 w-4" />
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <p className="text-sm text-center text-slate-500">
                                Already have an account?{" "}
                                <Link
                                    href="/auth/signin"
                                    className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
                                >
                                    Sign in here →
                                </Link>
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Right panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative z-10 items-center justify-center p-12">
                <div className="max-w-md text-white">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight">Project Tracker</span>
                    </div>
                    <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
                        Get Started
                    </h1>
                    <p className="text-lg text-white/80 mt-4 leading-relaxed">
                        Create your account and take control of your project management workflow.
                    </p>

                    {/* Feature bullets */}
                    <div className="mt-10 space-y-4">
                        {[
                            { emoji: "🚀", text: "Quick and easy setup" },
                            { emoji: "🔒", text: "Secure authentication" },
                            { emoji: "🎯", text: "Organize tasks by project" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                                <span className="text-2xl">{item.emoji}</span>
                                <span className="text-sm font-medium">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
