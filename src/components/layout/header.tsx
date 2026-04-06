"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/projects": "Projects",
    "/timeline": "Timeline",
    "/settings": "Settings",
};

export function Header() {
    const pathname = usePathname();

    // Derive page title from pathname
    let title = "Dashboard";
    for (const [path, label] of Object.entries(pageTitles)) {
        if (pathname.startsWith(path)) {
            title = label;
            break;
        }
    }

    // Check for project detail page
    const projectMatch = pathname.match(/^\/projects\/[^/]+$/);
    if (projectMatch) {
        title = "Project Details";
    }

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex-1">
                <h1 className="text-lg font-bold tracking-tight">{title}</h1>
            </div>
            <div className="flex items-center gap-4">
                <ThemeToggle />
            </div>
        </header>
    );
}
