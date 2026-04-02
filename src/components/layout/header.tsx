"use client";

import { ThemeToggle } from "./theme-toggle";

export function Header() {
    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-6">
            <div className="flex-1">
                <h1 className="text-lg font-semibold">Welcome back</h1>
            </div>
            <div className="flex items-center gap-4">
                <ThemeToggle />
            </div>
        </header>
    );
}
