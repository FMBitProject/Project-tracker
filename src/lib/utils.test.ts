import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn()", () => {
    it("merges class names correctly", () => {
        expect(cn("px-2", "py-3")).toBe("px-2 py-3");
    });

    it("handles falsy values", () => {
        expect(cn("px-2", false, null, undefined, "py-3")).toBe("px-2 py-3");
    });

    it("handles arrays", () => {
        expect(cn(["px-2", "py-3"])).toBe("px-2 py-3");
    });

    it("resolves tailwind conflicts — last one wins", () => {
        expect(cn("px-2", "px-4")).toBe("px-4");
    });

    it("merges bg-color conflicts correctly via twMerge", () => {
        expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    });

    it("works with conditional classes", () => {
        const isActive = true;
        expect(cn("base", isActive && "active")).toBe("base active");

        const isInactive = false;
        expect(cn("base", isInactive && "active")).toBe("base");
    });

    it("handles empty input", () => {
        expect(cn()).toBe("");
    });

    it("handles nested arrays", () => {
        expect(cn(["px-2", ["py-3", "font-bold"]])).toBe("px-2 py-3 font-bold");
    });
});
