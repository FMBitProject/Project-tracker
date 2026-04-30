import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    test: {
        environment: "jsdom",
        setupFiles: ["src/setup-tests.ts"],
        include: ["src/**/*.test.{ts,tsx}"],
        exclude: ["node_modules", ".next", "drizzle"],
        globals: true,
        server: {
            deps: {
                inline: ["remark-gfm", "remark-breaks", "react-markdown", "micromark", "mdast-util-*", "unist-util-*", "unified", "bail", "trough", "vfile", "is-plain-obj"],
            },
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
