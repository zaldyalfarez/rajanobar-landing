# Raja Nobar Indonesia

## Mission

Create implementation-ready, token-driven UI guidance for Raja Nobar Indonesia that is optimized for consistency, accessibility, and fast delivery across dashboard web app.

## Brand

- Product/brand: Raja Nobar Indonesia
- URL: https://rajanobar.id/
- Audience: authenticated users and operators
- Product surface: dashboard web app

## Style Foundations

- Visual style: structured, tokenized, content-first
- Main font style: `font.family.primary=Inter`, `font.family.stack=Inter, sans-serif`, `font.size.base=16px`, `font.weight.base=400`, `font.lineHeight.base=24px`
- Typography scale: `font.size.xs=10px`, `font.size.sm=12px`, `font.size.md=14px`, `font.size.lg=16px`, `font.size.xl=18px`, `font.size.2xl=24px`, `font.size.3xl=30px`, `font.size.4xl=36px`
- Color palette: `color.text.primary=#ffffff`, `color.text.secondary=#002c22`, `color.text.tertiary=oklch(0.145 0 0)`, `color.text.inverse=#1a1a1a`, `color.border.default=#000000`, `color.surface.muted=#174f35`, `color.surface.raised=#dc2626`, `color.surface.strong=oklab(0.999994 0.0000455678 0.0000200868 / 0.05)`, `color.border.muted=oklab(0.999994 0.0000455678 0.0000200868 / 0.1)`, `color.focus.ring=oklab(0.708 0 0 / 0.5)`
- Spacing scale: `space.1=12px`, `space.2=13px`, `space.3=16px`, `space.4=16.5px`, `space.5=17.5px`, `space.6=20px`, `space.7=28px`, `space.8=32px`
- Radius/shadow/motion tokens: `radius.xs=8px`, `radius.sm=12px`, `radius.md=100px`, `radius.lg=26843500px` | `shadow.1=rgba(239, 1, 7, 0.796) 0px 0px 19.9027px 0px, rgba(239, 1, 7, 0.5) 0px 0px 39.8055px 0px`, `shadow.2=rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px`, `shadow.3=rgba(239, 1, 7, 0.53) 0px 0px 10.9621px 0px, rgba(239, 1, 7, 0.32) 0px 0px 21.9242px 0px`, `shadow.4=rgba(156, 127, 73, 0.796) 0px 0px 19.9027px 0px, rgba(156, 127, 73, 0.5) 0px 0px 39.8055px 0px` | `motion.duration.instant=150ms`, `motion.duration.fast=250ms`, `motion.duration.normal=300ms`

## Accessibility

- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone

Concise, confident, implementation-focused.

## Rules: Do

- Use semantic tokens, not raw hex values, in component guidance.
- Every component must define states for default, hover, focus-visible, active, disabled, loading, and error.
- Component behavior should specify responsive and edge-case handling.
- Interactive components must document keyboard, pointer, and touch behavior.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't

- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.
- Do not ship component guidance without explicit state rules.

## Guideline Authoring Workflow

1. Restate design intent in one sentence.
2. Define foundations and semantic tokens.
3. Define component anatomy, variants, interactions, and state behavior.
4. Add accessibility acceptance criteria with pass/fail checks.
5. Add anti-patterns, migration notes, and edge-case handling.
6. End with a QA checklist.

## Required Output Structure

- Context and goals.
- Design tokens and foundations.
- Component-level rules (anatomy, variants, states, responsive behavior).
- Accessibility requirements and testable acceptance criteria.
- Content and tone standards with examples.
- Anti-patterns and prohibited implementations.
- QA checklist.

## Component Rule Expectations

- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.
- Include known page component density: links (44), buttons (8), navigation (3).

- Extraction diagnostics: Audience and product surface inference confidence is low; verify generated brand context.

## Quality Gates

- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Teams should prefer system consistency over local visual exceptions.
