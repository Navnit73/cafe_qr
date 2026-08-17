import React from "react";
import type { MDXComponents } from "mdx/types";
import { QRCode, QRCodeGenerator, QRCodeBatch } from "@/components/qr-code";
import {
  Info,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { clsx } from "clsx";

/**
 * Editorial Callout Box with Vibrant Iconography
 */
export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: "info" | "tip" | "warning" | "success";
  title?: string;
  children: React.ReactNode;
}) {
  const styles = {
    info: {
      border: "border-brand-blue/30",
      bg: "bg-surface-1",
      icon: Info,
      iconColor: "text-brand-blue",
      defaultTitle: "Note",
    },
    tip: {
      border: "border-fin-orange/30",
      bg: "bg-[#fffaf7]",
      icon: Lightbulb,
      iconColor: "text-fin-orange",
      defaultTitle: "Pro Tip",
    },
    warning: {
      border: "border-report-orange/40",
      bg: "bg-[#fffbf5]",
      icon: AlertTriangle,
      iconColor: "text-report-orange",
      defaultTitle: "Important",
    },
    success: {
      border: "border-[#bbf7d0]",
      bg: "bg-[#f0fdf4]",
      icon: CheckCircle2,
      iconColor: "text-[#059669]",
      defaultTitle: "Success",
    },
  }[type];

  const Icon = styles.icon;

  return (
    <div
      className={clsx(
        "p-4 sm:p-5 rounded-xl border my-6 text-xs leading-relaxed space-y-1.5 ",
        styles.border,
        styles.bg
      )}
    >
      <div className="flex items-center gap-2 font-semibold text-ink">
        <Icon className={clsx("w-4 h-4 shrink-0", styles.iconColor)} />
        <span>{title || styles.defaultTitle}</span>
      </div>
      <div className="text-ink-muted pl-6">{children}</div>
    </div>
  );
}

/**
 * Visual Step Card with Colored Step Badge
 */
export function StepCard({
  number,
  title,
  children,
}: {
  number: number | string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card bg-surface-1 border border-hairline rounded-xl  my-4 overflow-hidden">
      <div className="card-body p-5">
        <div className="flex items-start gap-3.5">
          <div className="w-7 h-7 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] text-[#059669] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ">
            {number}
          </div>
          <div className="space-y-1.5 flex-1">
            <h4 className="text-sm font-semibold text-ink">{title}</h4>
            <div className="text-xs text-ink-muted leading-relaxed">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Custom MDX component map for guide pages.
 */
export function getGuideMDXComponents(): MDXComponents {
  return {
    // Embedded Custom Components
    QRCode,
    QRCodeGenerator,
    QRCodeBatch,
    Callout,
    StepCard,

    // Headings — auto-generate IDs for anchor links
    h2: ({ children, ...props }) => {
      const id = slugify(children);
      return (
        <h2
          id={id}
          className="text-xl sm:text-2xl font-medium tracking-tight text-ink mt-10 mb-4 scroll-mt-24 pb-2 border-b border-hairline-soft flex items-center gap-2"
          {...props}
        >
          <span>{children}</span>
        </h2>
      );
    },
    h3: ({ children, ...props }) => {
      const id = slugify(children);
      return (
        <h3
          id={id}
          className="text-base sm:text-lg font-medium text-ink mt-7 mb-3 scroll-mt-24"
          {...props}
        >
          {children}
        </h3>
      );
    },
    h4: ({ children, ...props }) => (
      <h4
        className="text-sm font-semibold text-ink mt-5 mb-2"
        {...props}
      >
        {children}
      </h4>
    ),

    // Body text
    p: ({ children, ...props }) => (
      <p
        className="text-sm text-ink-muted leading-relaxed mb-4"
        {...props}
      >
        {children}
      </p>
    ),

    // Links
    a: ({ href, children, ...props }) => (
      <a
        href={href}
        className="text-sm font-medium text-ink underline decoration-hairline underline-offset-2 hover:text-fin-orange transition-colors"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    ),

    // Lists
    ul: ({ children, ...props }) => (
      <ul
        className="list-disc list-outside ml-5 space-y-2 text-sm text-ink-muted leading-relaxed mb-5"
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol
        className="list-decimal list-outside ml-5 space-y-2 text-sm text-ink-muted leading-relaxed mb-5"
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="text-sm text-ink-muted pl-1" {...props}>
        {children}
      </li>
    ),

    // Table — daisyUI responsive table with clean styling
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto rounded-xl border border-hairline bg-surface-1 my-6 ">
        <table className="table table-sm sm:table-md w-full" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead className="bg-canvas border-b border-hairline text-xs font-semibold text-ink uppercase tracking-wider" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }) => (
      <tbody className="divide-y divide-hairline-soft text-xs sm:text-sm text-ink-muted" {...props}>
        {children}
      </tbody>
    ),
    th: ({ children, ...props }) => (
      <th className="text-left text-xs font-semibold text-ink px-4 py-3" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="px-4 py-3 text-xs sm:text-sm text-ink-muted" {...props}>
        {children}
      </td>
    ),
    tr: ({ children, ...props }) => (
      <tr className="hover:bg-canvas/50 transition-colors" {...props}>
        {children}
      </tr>
    ),

    // Blockquote
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-l-3 border-fin-orange bg-surface-1 rounded-r-xl px-5 py-4 my-6 text-sm text-ink-muted italic "
        {...props}
      >
        {children}
      </blockquote>
    ),

    // Code & pre
    code: ({ children, ...props }) => (
      <code
        className="bg-canvas border border-hairline-soft text-ink text-xs font-mono rounded px-1.5 py-0.5"
        {...props}
      >
        {children}
      </code>
    ),
    pre: ({ children, ...props }) => (
      <pre
        className="bg-[#111111] text-white rounded-xl p-4 overflow-x-auto my-6 text-xs leading-relaxed font-mono "
        {...props}
      >
        {children}
      </pre>
    ),

    // Horizontal rule
    hr: (props) => (
      <hr className="border-hairline-soft my-8" {...props} />
    ),

    // Strong / Em
    strong: ({ children, ...props }) => (
      <strong className="font-semibold text-ink" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }) => (
      <em className="italic text-ink-muted" {...props}>
        {children}
      </em>
    ),
  };
}

// ---------------------------------------------------------------------------
// Helper: generate a URL-safe slug from heading content
// ---------------------------------------------------------------------------
function slugify(children: React.ReactNode): string {
  const text = extractText(children);
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement(node)) {
    const props = node.props as Record<string, unknown>;
    if (props.children) {
      return extractText(props.children as React.ReactNode);
    }
  }
  return "";
}
