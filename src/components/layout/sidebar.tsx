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
    },
    {
        href: "/projects",
        label: "Projects",
        icon: FolderKanban,
    },
    {
        href: "/timeline",
        label: "Timeline",
        icon: Calendar,
    },
    {
        href: "/history",
        label: "History",
        icon: HistoryIcon,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-background">
            <div className="flex h-full flex-col">
                {/* Logo */}
                <div className="flex h-16 items-center border-b px-5">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-md">
                            <Sparkles className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-foreground">
                            Project Tracker
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-3 py-5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-secondary text-secondary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <Icon className="h-5 w-5 shrink-0" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom actions */}
                <div className="border-t p-3 space-y-1">
                    <Link
                        href="/settings"
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            pathname === "/settings" || pathname.startsWith("/settings/")
                                ? "bg-secondary text-secondary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <Settings className="h-5 w-5 shrink-0" />
                        Settings
                    </Link>
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg"
                        onClick={async () => {
                            await signOut();
                            window.location.href = "/auth/signin";
                        }}
                    >
                        <LogOut className="h-5 w-5 shrink-0" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </aside>
    );
}
