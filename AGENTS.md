<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Working Rules

1. **Check first, write second.** Before creating or editing any component: (a) read `DESIGN.md` and `globals.css` for existing tokens, (b) search the codebase for an existing similar component before creating a new one, (c) only then write code.
2. **daisyUI by default.** Use daisyUI component classes for any UI element that daisyUI provides (`btn`, `input`, `card`, `modal`, `navbar`, `alert`, `fieldset`, `checkbox`, etc.). Only write custom CSS/Tailwind for layout/spacing that daisyUI doesn't cover.
3. **No hardcoded design values.** Colors, fonts, radii, and spacing must come from `globals.css` variables / Tailwind theme tokens — if a value is missing, add it to `globals.css` first, then use it.
4. **No new dependencies without checking `package.json` first** — confirm a package isn't already installed (or replaceable by one that is) before adding it.
5. **State assumptions before large changes.** If a requirement is ambiguous, state the assumption made and proceed — don't block on it unless it risks a wrong architecture.
