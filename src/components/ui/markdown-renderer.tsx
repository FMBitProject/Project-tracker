"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
    content: string | null | undefined;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    if (!content || content.trim() === "") {
        return <p className="text-muted-foreground text-sm">No description added yet.</p>;
    }

    return (
        <div className="text-sm leading-relaxed space-y-3">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ children }) => (
                        <h1 className="text-xl font-bold mt-4 mb-3 first:mt-0">{children}</h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-lg font-semibold mt-3 mb-2 first:mt-0">{children}</h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-base font-semibold mt-3 mb-2 first:mt-0">{children}</h3>
                    ),
                    p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                    ul: ({ children }) => (
                        <ul className="list-disc pl-6 mb-3 space-y-1">{children}</ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="list-decimal pl-6 mb-3 space-y-1">{children}</ol>
                    ),
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-3">
                            {children}
                        </blockquote>
                    ),
                    hr: () => <hr className="border-border my-4" />,
                    table: ({ children }) => (
                        <div className="overflow-x-auto mb-3">
                            <table className="w-full border-collapse">{children}</table>
                        </div>
                    ),
                    thead: ({ children }) => <thead>{children}</thead>,
                    tbody: ({ children }) => <tbody>{children}</tbody>,
                    tr: ({ children }) => <tr className="even:bg-muted/50">{children}</tr>,
                    th: ({ children }) => (
                        <th className="border border-border px-3 py-2 bg-muted font-semibold text-left text-sm">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="border border-border px-3 py-2 text-sm">{children}</td>
                    ),
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline hover:text-blue-600"
                        >
                            {children}
                        </a>
                    ),
                    code: ({ className, children, ...props }) => {
                        const isInline = !className;
                        if (isInline) {
                            return (
                                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                                    {children}
                                </code>
                            );
                        }
                        return (
                            <pre className="bg-muted p-4 rounded-md overflow-x-auto mb-3">
                                <code className="text-sm font-mono" {...props}>
                                    {children}
                                </code>
                            </pre>
                        );
                    },
                    img: ({ src, alt }) => (
                        <img src={src} alt={alt} className="rounded-md max-w-full mb-3" />
                    ),
                    del: ({ children }) => (
                        <del className="line-through text-muted-foreground">{children}</del>
                    ),
                    input: ({ checked, ...props }) => (
                        <input
                            type="checkbox"
                            checked={checked}
                            readOnly
                            className="mr-2 accent-primary"
                            {...props}
                        />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
