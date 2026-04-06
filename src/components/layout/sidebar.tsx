"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FolderKanban,
    Calendar,
    Settings,
    LogOut,
    History as HistoryIcon,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth/client";

const navItems = [
    {
        href: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        gradient: "from-blue-500 to-indigo-600",
        bg: "bg-blue-50 dark:bg-blue-950/40",
        text: "text-blue-700 dark:text-blue-300",
        ring: "ring-blue-200 dark:ring-blue-800",
    },
    {
        href: "/projects",
        label: "Projects",
        icon: FolderKanban,
        gradient: "from-purple-500 to-pink-600",
        bg: "bg-purple-50 dark:bg-purple-950/40",
        text: "text-purple-700 dark:text-purple-300",
        ring: "ring-purple-200 dark:ring-purple-800",
    },
    {
        href: "/timeline",
        label: "Timeline",
        icon: Calendar,
        gradient: "from-cyan-500 to-blue-600",
        bg: "bg-cyan-50 dark:bg-cyan-950/40",
        text: "text-cyan-700 dark:text-cyan-300",
        ring: "ring-cyan-200 dark:ring-cyan-800",
    },
    {
        href: "/history",
        label: "History",
        icon: HistoryIcon,
        gradient: "from-emerald-500 to-teal-600",
        bg: "bg-emerald-50 dark:bg-emerald-950/40",
        text: "text-emerald-700 dark:text-emerald-300",
        ring: "ring-emerald-200 dark:ring-emerald-800",
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-r border-border shadow-xl">
            <div className="flex h-full flex-col">
                {/* Logo */}
                <div className="flex h-16 items-center border-b border-border/50 dark:border-white/10 px-5">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-extrabold tracking-tight text-slate-800 dark:text-white">
                            Project Tracker
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1.5 px-3 py-5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
                                    isActive
                                        ? cn("bg-gradient-to-r shadow-lg ring-1", item.gradient, "text-white", item.ring)
                                        : "text-slate-500 hover:bg-gray-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                                )}
                            >
                                <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400 dark:text-slate-500")} />
                                {item.label}
                                {isActive && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom actions */}
                <div className="border-t border-border/50 dark:border-white/10 p-3 space-y-1.5">
                    <Link
                        href="/settings"
                        className={cn(
                            "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all",
                            pathname === "/settings"
                                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg ring-1 ring-amber-300"
                                : "text-slate-500 hover:bg-gray-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                        )}
                    >
                        <Settings className={cn("h-5 w-5", pathname === "/settings" ? "text-white" : "text-slate-400 dark:text-slate-500")} />
                        Settings
                    </Link>
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-slate-500 hover:text-slate-900 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 rounded-xl font-semibold"
                        onClick={async () => {
                            await signOut();
                            window.location.href = "/auth/signin";
                        }}
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </aside>
    );
}
