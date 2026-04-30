import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

describe("MarkdownRenderer", () => {
    it("renders plain text", () => {
        render(<MarkdownRenderer content="Hello world" />);
        expect(screen.getByText("Hello world")).toBeInTheDocument();
    });

    it("shows fallback for null content", () => {
        render(<MarkdownRenderer content={null} />);
        expect(screen.getByText("No description added yet.")).toBeInTheDocument();
    });

    it("shows fallback for empty string", () => {
        render(<MarkdownRenderer content="" />);
        expect(screen.getByText("No description added yet.")).toBeInTheDocument();
    });

    it("shows fallback for whitespace-only content", () => {
        render(<MarkdownRenderer content="   " />);
        expect(screen.getByText("No description added yet.")).toBeInTheDocument();
    });

    it("renders content within a container div", () => {
        render(<MarkdownRenderer content="Test content" />);
        const container = screen.getByText("Test content").closest("div");
        expect(container).toHaveClass("text-sm", "leading-relaxed", "space-y-3");
    });

    it("renders markdown content via ReactMarkdown (presence check)", () => {
        const { container } = render(<MarkdownRenderer content="# Test" />);
        expect(container.querySelector("h1")).toBeInTheDocument();
    });

    it("renders bold and italic text as paragraph content", () => {
        render(<MarkdownRenderer content="**bold** and *italic*" />);
        expect(screen.getByText(/bold/)).toBeInTheDocument();
        expect(screen.getByText(/italic/)).toBeInTheDocument();
    });

    it("renders links", () => {
        render(<MarkdownRenderer content="[click here](https://example.com)" />);
        const link = screen.getByRole("link", { name: /click here/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "https://example.com");
        expect(link).toHaveAttribute("target", "_blank");
    });

    it("renders inline code", () => {
        render(<MarkdownRenderer content="Use the `useState` hook" />);
        expect(screen.getByText("useState")).toBeInTheDocument();
    });

    it("renders strikethrough", () => {
        render(<MarkdownRenderer content="~~removed~~" />);
        expect(screen.getByText("removed")).toBeInTheDocument();
    });

    it("renders blockquotes", () => {
        render(<MarkdownRenderer content="> This is a quote" />);
        expect(screen.getByText("This is a quote")).toBeInTheDocument();
    });
});
