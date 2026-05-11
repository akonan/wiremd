# wiremd Visual Styles

Pass as `--style <name>` on the CLI or `{ style: 'name' }` in the API.

---

## sketch (default)

Balsamiq-inspired hand-drawn look. Comic Sans font, rough borders, scribbled fills on buttons.
Immediately reads as "this is a rough draft, not final design" — which manages stakeholder
expectations and keeps feedback focused on structure rather than aesthetics.

**Use when:** early ideation, sharing with clients before visual design is finalized, making it
explicit that feedback should be about layout and flow, not pixels.

---

## clean

Modern minimal. Clean sans-serif font, flat design, subtle shadows, neutral palette. Looks
polished without looking finished. The most versatile style — works for almost any audience.

**Use when:** internal handoff to engineering or design, stakeholder review, PM documentation,
any time you need the wireframe to be easy to read without looking like a production UI.

**Default choice** — if you're not sure which style to use, use this one.

---

## wireframe

Traditional wireframe aesthetic: grayscale, hatched fills on images and colored areas, monospace
or system font, explicit placeholder boxes. Looks like what a UX designer would produce in Balsamiq
or Axure.

**Use when:** low-fidelity explorations where you want to signal "this is deliberately rough",
creating documentation that needs to look like traditional wireframes, working with audiences
who are familiar with UX deliverables.

---

## material

Google Material Design: elevation shadows, ripple-style buttons, Material color palette (blue
primary, teal accent), Roboto font. Grid-based layout.

**Use when:** the product is built on Material Design or uses a Material component library,
and you want the wireframe to feel native to that visual language.

---

## tailwind

Utility-first aesthetic with Tailwind's default color palette (indigo/purple primary), Inter
font, rounded corners, clean card shadows. Familiar to teams building with Tailwind CSS.

**Use when:** the team is building with Tailwind and you want the wireframe to match the feel
of what will be built without being fully designed.

---

## brutal

Neo-brutalism: bold black borders, high-contrast fills, stark typography, no soft shadows.
Deliberately loud and graphic.

**Use when:** the product intentionally uses a brutalist visual style, or when you want the
wireframe to stand out and provoke strong reactions in a review session. Not appropriate for
standard enterprise or consumer product wireframing.

---

## none

Unstyled semantic HTML. No CSS beyond basic browser defaults.

**Use when:** embedding wireframe output into a custom stylesheet, building tooling on top of
wiremd output, or when you want a clean baseline to apply your own styles.
