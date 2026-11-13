# Modern React Website Design & Engineering Rules

> **Purpose:** A practical design and implementation standard for building polished, responsive, dynamic React websites with maintainable code, ESLint enforcement, and purposeful motion.
>
> **Reference direction:** SOLARA HALO S1 — an editorial product-launch experience built around a premium physical product, cinematic storytelling, interactive 3D product viewing, finish selection, technical feature sections, and a clear conversion path.
>
> **Scope:** React + modern JavaScript/TypeScript + CSS, with optional GSAP, Motion for React, and React Spring. Use only the animation systems a project actually needs.

---

## 1. Product and design principles

Every implementation must satisfy these principles, in priority order:

1. **Clarity before decoration.** A visitor must understand what the product/site is, why it matters, and what action to take.
2. **Strong art direction.** Define a visual concept, typography, color, imagery, layout rhythm, and motion language before building components.
3. **Content-led composition.** Layout should support the message, not force content into decorative patterns.
4. **Consistent interaction.** Controls behave predictably and provide visible feedback.
5. **Responsive by default.** Design from small screens upward; do not treat mobile as a compressed desktop.
6. **Accessible by default.** Keyboard access, readable contrast, semantic HTML, reduced motion, and assistive-technology support are requirements.
7. **Performance is part of design.** Avoid visual effects that make the site slow, unstable, or difficult to use.
8. **Maintainable implementation.** Components, tokens, state, and animation ownership must be explicit.
9. **Progressive enhancement.** Core content and navigation work when animation, WebGL, or third-party assets fail.
10. **Measure quality.** Verify usability, accessibility, responsiveness, and Core Web Vitals rather than relying on visual taste alone.

### Non-negotiable rules

- Never sacrifice usability for an award-style effect.
- Never use animation to hide slow loading or unclear information.
- Never use a custom cursor as the only way to discover an interaction.
- Never hijack native scrolling or disable browser zoom.
- Never make essential content available only inside a canvas or WebGL scene.
- Never ship placeholder links, dead buttons, fake forms, or non-functional controls.
- Never add a library when CSS or native browser behavior is sufficient.

---

## 2. Visual direction and design system

### 2.1 Establish a visual concept

Before coding, write a one-paragraph creative direction covering:

- Brand personality and audience.
- Primary message and conversion goal.
- Visual metaphor or narrative.
- Typography character.
- Color and material language.
- Image/video/3D art direction.
- Motion character: restrained, playful, cinematic, technical, or editorial.

A product site should communicate the product first. A portfolio should communicate the creator's work first. Do not reuse the same visual template for unrelated products.

### 2.2 Design tokens

Create tokens centrally. Do not scatter arbitrary hex values, spacing values, shadows, or easing curves throughout components.

```css
:root {
  color-scheme: light;

  /* Color */
  --color-bg: #f4f2ed;
  --color-surface: #ffffff;
  --color-text: #171717;
  --color-muted: #686868;
  --color-border: rgb(23 23 23 / 12%);
  --color-accent: #b7ff4a;
  --color-inverse: #101010;

  /* Typography */
  --font-display: "Manrope", sans-serif;
  --font-body: "Inter", sans-serif;
  --font-mono: "IBM Plex Mono", monospace;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.25rem;
  --text-xl: clamp(1.5rem, 2.5vw, 2.25rem);
  --text-display: clamp(3rem, 9vw, 9rem);

  /* Layout */
  --content-width: 1440px;
  --reading-width: 68ch;
  --page-gutter: clamp(1rem, 4vw, 4rem);
  --section-space: clamp(5rem, 11vw, 12rem);
  --grid-gap: clamp(1rem, 2vw, 2rem);

  /* Shape and depth */
  --radius-sm: 0.5rem;
  --radius-md: 1rem;
  --radius-lg: 1.75rem;
  --shadow-soft: 0 18px 60px rgb(0 0 0 / 8%);

  /* Motion */
  --ease-standard: cubic-bezier(0.2, 0.7, 0.2, 1);
  --ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 160ms;
  --duration-base: 320ms;
  --duration-slow: 700ms;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 6rem;
}

body {
  margin: 0;
  min-width: 320px;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  line-height: 1.5;
  text-rendering: optimizeLegibility;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

button,
input,
textarea,
select {
  font: inherit;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 4px;
}
```

Rules:

- Use CSS custom properties for repeated values and themes.
- Use `clamp()` for fluid type and spacing where it improves continuity.
- Prefer `rem`, `%`, `min()`, `max()`, `clamp()`, grid, flexbox, and intrinsic sizing.
- Prefer logical properties (`margin-inline`, `padding-block`) where appropriate.
- Use a limited palette: neutral base, text colors, one primary accent, and semantic status colors.
- Keep body copy readable; avoid long lines wider than roughly 65–75 characters.
- Use a deliberate type scale and no more than two or three font families.
- Load only the font weights and character subsets actually used.
- Use tabular numerals for prices, statistics, timers, and comparison data.
- Use `font-display: swap` and avoid layout shifts when web fonts load.
- Do not use `transition: all`; name the properties being transitioned.
- Avoid excessive blur, glassmorphism, gradients, and shadows. Use them only when they reinforce the concept.

### 2.3 Typography

- Use semantic heading levels in document order.
- Use one clear page-level `h1`; section headings should form a meaningful hierarchy.
- Headlines may be expressive, but body text must remain highly readable.
- Keep line length, line height, and paragraph spacing consistent.
- Do not use text as an image.
- Avoid overly tight tracking on small text and long paragraphs.
- Avoid widows/orphans where practical; use balanced wrapping for large headings.
- Do not communicate meaning through font weight or color alone.

### 2.4 Layout and composition

- Establish a consistent grid and alignment system.
- Use whitespace to establish hierarchy, not as a substitute for content.
- Mix full-bleed media with constrained text blocks intentionally.
- Use asymmetry only when the composition remains easy to scan.
- Use CSS Grid for two-dimensional composition and Flexbox for one-dimensional alignment.
- Prefer `aspect-ratio` to hard-coded image heights.
- Use `object-fit: cover` only when cropping does not remove important information.
- Reserve media dimensions to prevent layout shift.
- Ensure long content, translations, zoom, and user-generated data do not break the layout.
- Avoid horizontal overflow at every supported viewport.
- Use sticky and fixed elements sparingly; they must not cover focused content.

---

## 3. SOLARA HALO S1 reference: patterns to study

The supplied Awwwards URL is:

- https://www.awwwards.com/sites/solara-halo-s1

The Awwwards page could not be fetched reliably during preparation. A matching SOLARA HALO S1 preview was discoverable at:

- https://templates-preview.oxvo.app/t/oxvo-original-studio-max-commerce-3d/latest/

Treat this as a **reference for observed page structure and interaction ideas**, not proof of the original site's source code, exact implementation, or award status.

### 3.1 Observed experience structure

The preview presents a premium portable spatial speaker through a sequence of product-story sections:

1. **Hero / product introduction**
   - Brand and product identity.
   - Large product visual with interactive 3D viewer.
   - Short positioning statement.
   - Primary actions such as choosing a finish or exploring acoustics.
   - Price and product context.

2. **Form**
   - Large editorial headline.
   - Product shell and material details.
   - Supporting visual and concise feature labels.

3. **Control**
   - Tactile control story.
   - Close-up visual and explanatory copy.

4. **Endurance**
   - Battery, sealing, portability, and durability claims.
   - Supporting feature callouts.

5. **Signature / product summary**
   - Reinforce the core product promise.
   - Return to the primary product visual and call to action.

6. **Acoustic engineering**
   - Explain the technology in digestible pillars.
   - Connect technical details to customer benefits.

7. **Finish selector**
   - Three finish options: Graphite Mesh, Mist Alloy, and Copper Signal.
   - Selecting a finish changes the visual state and descriptive copy.
   - The silhouette stays consistent while the material/color presentation changes.

8. **Specifications**
   - Structured product data grouped by category.
   - Clear distinction between validated facts and targets or estimates.

9. **Detail gallery**
   - Close-up product details with captions.
   - Material, control, construction, and portability stories.

10. **Final conversion section**
    - Re-state the product promise.
    - Present the selected finish and quantity.
    - Provide a clear next action.
    - Clarify whether the experience is a real checkout or a non-transactional preview.

### 3.2 Design lessons to adapt

- Use a single hero object as the visual anchor.
- Build a narrative that moves from emotional promise to physical details to technical proof to conversion.
- Alternate large product imagery with compact editorial copy.
- Give each section one purpose and one visual focal point.
- Keep repeated calls to action consistent.
- Use product variants as a meaningful interaction, not a decorative toggle.
- Make the 3D object keyboard- and touch-accessible, with clear fallback imagery.
- Keep product claims accurate; label prototype targets and unvalidated specifications.
- Make checkout, reservation, and preview states unmistakably different.
- Use a sticky or persistent purchase summary only if it helps users understand the current selection.

### 3.3 Suggested React component map

```text
src/
  app/
    App.jsx
    routes.jsx
  components/
    layout/
      SiteHeader.jsx
      SiteFooter.jsx
      PageContainer.jsx
    product/
      ProductViewer.jsx
      ProductFinishSelector.jsx
      ProductFeature.jsx
      ProductSpecs.jsx
      ProductGallery.jsx
      PurchasePanel.jsx
    motion/
      Reveal.jsx
      MotionPreference.jsx
  sections/
    HeroSection.jsx
    FormSection.jsx
    ControlSection.jsx
    EnduranceSection.jsx
    EngineeringSection.jsx
    FinishSection.jsx
    DetailsSection.jsx
    FinalCtaSection.jsx
  data/
    product.js
  hooks/
    useReducedMotion.js
  styles/
    tokens.css
    global.css
    components.css
  assets/
```

Keep content and product data outside presentation components. Avoid creating a separate component for every trivial wrapper; extract components when they have independent meaning, reuse, state, or complexity.

---

## 4. React architecture rules

### 4.1 Component design

- Use function components and hooks.
- Keep components focused on one responsibility.
- Keep render functions pure: same props/state/context should produce the same UI.
- Never mutate props, state, or values derived from them.
- Do not call components as ordinary functions.
- Use stable, meaningful keys for mapped elements; never use array indices for reorderable lists.
- Keep state as close as possible to the components that need it.
- Lift state only when multiple components must coordinate.
- Use Context for genuinely shared cross-tree state, not as a default global store.
- Use a state-management library only when the application complexity justifies it.
- Prefer derived values over duplicated state.
- Keep event handlers named and readable.
- Avoid deeply nested ternaries; use early returns or small helper functions.
- Use error boundaries around meaningful failure zones.
- Use `Suspense` and lazy loading for appropriate route or heavy-component boundaries.
- Do not memoize every component. Use `memo`, `useMemo`, and `useCallback` after measuring or when referential stability is required.

### 4.2 Hooks

- Call hooks only at the top level of React components or custom hooks.
- Never call hooks conditionally, inside loops, or inside nested functions.
- Include all reactive dependencies in effects.
- Avoid effects for values that can be calculated during render.
- Use effects to synchronize with external systems, not to orchestrate ordinary application data flow.
- Clean up event listeners, observers, subscriptions, timers, and imperative animation instances.
- Avoid stale closures; use correct dependencies and stable callbacks where needed.
- Prefer `useId()` for stable accessibility IDs, not list keys.

### 4.3 State and data

- Keep server state, URL state, and local UI state conceptually separate.
- Store shareable filters, tabs, pagination, and search state in the URL when appropriate.
- Validate external data at boundaries.
- Handle loading, success, empty, error, and retry states.
- Do not assume network requests always succeed or return complete data.
- Cancel or ignore stale requests when the user changes route or query.
- Avoid storing secrets or sensitive data in local storage.
- Do not store derived data when it can be computed.
- Use optimistic updates only when rollback and error handling are implemented.

### 4.4 Routing and navigation

- Use a routing library for multi-page applications.
- Use real links for navigation and buttons for actions.
- Preserve browser back/forward behavior.
- Make routes refresh-safe and directly addressable.
- Update document title and metadata per route.
- Provide a not-found route and meaningful error route.
- Keep focus management correct after route changes.
- Do not intercept every link click or disable native browser behaviors.

### 4.5 Suggested naming conventions

| Item | Convention | Example |
|---|---|---|
| React components | PascalCase | `ProductViewer.jsx` |
| Hooks | `use` + camelCase | `useReducedMotion.js` |
| Utilities | camelCase | `formatPrice.js` |
| Constants | UPPER_SNAKE_CASE for true constants | `DEFAULT_FINISH` |
| CSS classes | kebab-case or CSS Modules | `.product-card` |
| Event handlers | `handle` + action | `handleFinishChange` |
| Boolean props | `is`, `has`, `can`, `should` | `isLoading` |

---

## 5. ESLint and code quality

Use ESLint's flat configuration (`eslint.config.js`) for modern ESLint versions. Add the React Hooks plugin and a formatter such as Prettier. ESLint catches code-quality issues; it does not replace tests, accessibility audits, or code review.

### 5.1 Install

```bash
npm install -D eslint @eslint/js globals eslint-plugin-react-hooks eslint-plugin-react eslint-plugin-jsx-a11y eslint-plugin-import eslint-config-prettier prettier
```

For TypeScript projects, also install and configure `typescript-eslint`.

### 5.2 Example `eslint.config.js`

This is a practical starting point for a browser-based React project using JSX. Adjust file globs and rules to match the actual stack.

```js
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";

export default [
  {
    ignores: ["dist/**", "build/**", "coverage/**", "node_modules/**"],
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      import: importPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",

      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-constant-condition": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "no-duplicate-imports": "error",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
  prettier,
];
```

> Plugin presets and exported config shapes can change between major versions. If a preset export differs in the installed version, use that plugin's current official flat-config documentation rather than copying an outdated legacy `.eslintrc` example.

### 5.3 Package scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier . --write",
    "format:check": "prettier . --check"
  }
}
```

### 5.4 ESLint standards

- Treat errors as build blockers.
- Keep warnings low and intentional.
- Do not disable a rule globally to silence one bad file.
- If a rule must be disabled, scope it narrowly and explain why.
- Do not use `eslint-disable` without a reason.
- Keep import order consistent.
- Remove unused variables, imports, and dead code.
- Use the React Hooks rules to catch invalid hook usage and dependency mistakes.
- Add accessibility linting, but still test with keyboard and assistive technology.
- Run lint and format checks in CI before merging.
- Keep ESLint, plugins, and configuration compatible with the project's installed versions.

---

## 6. Animation system: choose clear ownership

The project may use **GSAP**, **Motion for React**, and **React Spring**, but they should not all control the same element or interaction.

### 6.1 Which tool should be used?

| Requirement | Preferred tool |
|---|---|
| Simple hover, focus, and state transitions | CSS |
| Small UI enter/exit and layout transitions | Motion for React |
| Scroll choreography, pinned sections, complex timelines | GSAP + ScrollTrigger |
| Physics-like drag, springy controls, interactive interpolation | React Spring |
| Simple continuous decorative animation | CSS, SVG, or video |
| 3D rendering | Three.js / React Three Fiber, with a separate animation owner |

**Rule:** One animation owner per element. Do not animate the same `transform` or `opacity` from CSS, GSAP, Motion, and React Spring at the same time.

### 6.2 Global motion principles

- Motion must communicate hierarchy, state, cause-and-effect, or meaningful brand character.
- Prefer `transform` and `opacity` for high-frequency animation.
- Avoid animating layout properties such as `width`, `height`, `top`, and `left` continuously.
- Avoid unnecessary scroll-jacking and forced smooth-scroll behavior.
- Make animations interruptible and responsive to user input.
- Use short durations for controls and longer durations only for deliberate storytelling.
- Avoid perpetual motion near important text or controls.
- Do not animate every section in the same way.
- Do not hide content indefinitely if an observer or animation fails.
- Respect `prefers-reduced-motion`.
- Avoid large numbers of simultaneous GPU-heavy effects.
- Test on low-powered mobile hardware and under CPU/network throttling.

### 6.3 Motion accessibility

Use a shared reduced-motion preference:

```jsx
import { useEffect, useState } from "react";

export function useReducedMotionPreference() {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}
```

For reduced motion:

- Remove parallax, scroll scrubbing, large scale changes, and decorative loops.
- Replace complex reveals with immediate visibility or subtle opacity changes.
- Do not make information depend on animation completion.
- Preserve interaction feedback and state changes.
- Provide pause/stop controls for automatically moving content that runs alongside other content for more than five seconds.
- Avoid flashing content.

---

## 7. GSAP in React

Use GSAP for complex, coordinated timelines and scroll-driven storytelling. Use `@gsap/react` and `useGSAP()` to scope animations and clean them up safely.

### 7.1 Install

```bash
npm install gsap @gsap/react
```

### 7.2 Basic scoped reveal

```jsx
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function HeroIntro() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      timeline
        .from("[data-hero-eyebrow]", {
          y: 16,
          opacity: 0,
          duration: 0.5,
        })
        .from(
          "[data-hero-title]",
          {
            yPercent: 110,
            opacity: 0,
            duration: 0.9,
          },
          "-=0.2",
        )
        .from(
          "[data-hero-copy], [data-hero-actions]",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.12,
          },
          "-=0.35",
        );
    },
    { scope: containerRef },
  );

  return (
    <section ref={containerRef} className="hero">
      <p data-hero-eyebrow>Portable spatial audio</p>
      <h1 data-hero-title>Sound that holds the room.</h1>
      <p data-hero-copy>Designed for wide, effortless listening.</p>
      <div data-hero-actions>{/* Actions */}</div>
    </section>
  );
}
```

### 7.3 ScrollTrigger section reveal

```jsx
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function FeatureStory() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      gsap.from("[data-feature-copy]", {
        y: 48,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-feature-section]",
          start: "top 78%",
          once: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} data-feature-section>
      <div data-feature-copy>
        <p>01 / Acoustic shell</p>
        <h2>Wrapped around air.</h2>
      </div>
    </section>
  );
}
```

### 7.4 GSAP rules

- Register plugins explicitly.
- Scope selectors to a component ref.
- Prefer `useGSAP()` over unmanaged `useEffect()` for GSAP work.
- Use `contextSafe()` for GSAP work created later inside event handlers or delayed callbacks.
- Let the hook/context clean up animations on unmount.
- Use `revertOnUpdate: true` when animations must be reverted and rebuilt when dependencies change.
- Do not create duplicate ScrollTriggers on repeated renders.
- Use `gsap.matchMedia()` for responsive animation variants.
- Disable or simplify pinned scenes on small screens when they harm usability.
- Do not pin large sections without testing scroll distance, keyboard navigation, and mobile browser behavior.
- Use ScrollTrigger sparingly; a normal document flow is often better.

---

## 8. Motion for React

Use Motion for React for component-level animation, gestures, layout transitions, and enter/exit states.

### 8.1 Install

```bash
npm install motion
```

### 8.2 Hero entrance

```jsx
import { motion } from "motion/react";

const intro = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function MotionHero() {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={intro}
    >
      <p>Portable spatial audio</p>
      <h1>Sound that holds the room.</h1>
    </motion.section>
  );
}
```

### 8.3 Staggered list

```jsx
import { motion } from "motion/react";

const list = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export function FeatureList({ features }) {
  return (
    <motion.ul variants={list} initial="hidden" whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}>
      {features.map((feature) => (
        <motion.li key={feature.id} variants={item}>
          {feature.title}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### 8.4 Interactive product finish selector

```jsx
import { useState } from "react";
import { LayoutGroup, motion } from "motion/react";

const finishes = ["Graphite Mesh", "Mist Alloy", "Copper Signal"];

export function FinishSelector() {
  const [selected, setSelected] = useState(finishes[0]);

  return (
    <LayoutGroup>
      <div className="finish-options" aria-label="Choose product finish">
        {finishes.map((finish) => {
          const active = selected === finish;

          return (
            <button
              key={finish}
              type="button"
              aria-pressed={active}
              onClick={() => setSelected(finish)}
              className="finish-option"
            >
              {active && (
                <motion.span
                  layoutId="finish-indicator"
                  className="finish-option__indicator"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span>{finish}</span>
            </button>
          );
        })}
      </div>
      <p aria-live="polite">Selected finish: {selected}</p>
    </LayoutGroup>
  );
}
```

### 8.5 Motion rules

- Use `AnimatePresence` for exit animations when elements are removed.
- Use `layout` and `layoutId` for layout/shared-element transitions.
- Use `whileHover`, `whileTap`, and drag gestures only when they improve discoverability or feedback.
- Ensure every gesture has a keyboard/tap alternative where applicable.
- Use `useReducedMotion()` or the shared preference hook to provide a reduced-motion variant.
- Do not animate large lists without considering rendering and accessibility costs.
- Avoid nested motion variants that make timing difficult to understand.
- Use stable React keys so exit animations behave correctly.

---

## 9. React Spring

Use React Spring for physics-based interaction, continuous values, drag interactions, and natural spring transitions. It is not the default tool for every entrance animation.

### 9.1 Install

```bash
npm install @react-spring/web
```

### 9.2 Basic spring

```jsx
import { useState } from "react";
import { animated, useSpring } from "@react-spring/web";

export function SpringCard() {
  const [active, setActive] = useState(false);

  const styles = useSpring({
    transform: active ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
    boxShadow: active
      ? "0 24px 60px rgba(0, 0, 0, 0.14)"
      : "0 8px 24px rgba(0, 0, 0, 0.08)",
    config: { tension: 280, friction: 24 },
  });

  return (
    <animated.button
      type="button"
      style={styles}
      onClick={() => setActive((value) => !value)}
    >
      Toggle product card
    </animated.button>
  );
}
```

### 9.3 Spring-driven numeric value

```jsx
import { animated, useSpring } from "@react-spring/web";

export function AnimatedValue({ value }) {
  const spring = useSpring({
    number: value,
    config: { tension: 170, friction: 26 },
  });

  return (
    <animated.span>
      {spring.number.to((number) => Math.round(number))}
    </animated.span>
  );
}
```

### 9.4 React Spring rules

- Use `animated` elements for animated values.
- Keep spring values in the animation layer, not duplicated into React state on every frame.
- Use `useSpring` for one coordinated spring and `useSprings` for a collection.
- Use `useTransition` for mount/unmount transitions.
- Use `useTrail` for naturally sequenced elements.
- Use `useChain` only when orchestration genuinely requires it.
- Use `useDrag` only with a clear interaction model and accessible alternatives.
- Avoid animating layout dimensions continuously unless measured and tested.
- Use sensible tension/friction values; avoid overshoot that harms clarity.
- Respect reduced motion and disable non-essential spring movement when requested.

---

## 10. Combining animation libraries safely

A project can use all three libraries, but each must own a different layer:

- **GSAP:** page-level timeline, scroll narrative, pinned product story.
- **Motion:** React component presence, menu/dialog transitions, layout changes, simple hover/tap feedback.
- **React Spring:** drag/physics interaction, product carousel inertia, spring-driven controls.

Example ownership map:

| UI element | Owner |
|---|---|
| Hero scroll sequence | GSAP |
| Mobile navigation drawer | Motion |
| Product finish indicator | Motion |
| Drag-to-rotate UI control | React Spring or the 3D engine, not both |
| Scroll-pinned engineering story | GSAP |
| Button hover | CSS |
| Modal enter/exit | Motion |
| Decorative background | CSS or video |

Do not import all animation libraries into every component. Keep animation code local to the components that need it. If two systems must coordinate, expose a small state/event boundary rather than letting them manipulate the same DOM node.

---

## 11. Interaction design

### 11.1 Buttons and links

- Use `<button>` for actions and `<a>`/router links for navigation.
- Every button must have a real action.
- Use explicit `type="button"` unless the button submits a form.
- Provide hover, focus-visible, active, disabled, and loading states.
- Use descriptive labels; icon-only buttons require accessible names.
- Keep touch targets at least 44 × 44 CSS pixels where practical.
- Do not use pointer cursor on non-interactive elements.
- Do not make a whole card clickable if it contains multiple independent actions.

### 11.2 Forms

- Every input needs a programmatic label.
- Use correct input types and autocomplete values.
- Validate on the client for feedback and on the server for trust.
- Explain errors in text, not color alone.
- Preserve user input after validation errors.
- Announce asynchronous success/error states with an appropriate live region.
- Do not block paste or password managers.
- Use `autocomplete`, `inputMode`, and `required` intentionally.
- Keep mobile input font size at least 16px to avoid unwanted browser zoom in common mobile browsers.

### 11.3 Menus, dialogs, and overlays

- Menus must work with keyboard and touch.
- Dialogs must manage focus, support Escape when appropriate, and return focus to the trigger.
- Prevent background interaction when a modal dialog is open.
- Do not hide important content behind hover-only interactions.
- Ensure sticky headers and overlays do not obscure anchor targets or focused controls.

### 11.4 Custom cursor

Use only as an optional enhancement:

- Never hide the native cursor globally without a robust fallback.
- Never use custom cursor text as the only accessible label.
- Disable or simplify on touch/coarse-pointer devices.
- Do not let the cursor block clicks or intercept pointer events.
- Respect reduced motion.
- Keep the native pointer behavior available for controls.

---

## 12. Responsive design

Design and test at content-driven breakpoints rather than targeting only named devices.

Suggested test widths:

- 320px: narrow mobile.
- 375–390px: common mobile.
- 768px: tablet portrait.
- 1024px: tablet landscape/small laptop.
- 1280–1440px: desktop.
- 1600–1920px: wide desktop.

Rules:

- Start with a usable mobile layout.
- Use fluid sizing and intrinsic layout before adding breakpoints.
- Use `minmax()` and `auto-fit`/`auto-fill` for resilient grids.
- Avoid fixed heights for text-heavy sections.
- Keep navigation usable without hover.
- Stack complex side-by-side product layouts on narrow screens.
- Simplify 3D, video, and parallax effects on mobile when needed.
- Ensure media controls remain reachable and visible.
- Respect safe areas with `env(safe-area-inset-*)`.
- Test portrait and landscape orientations.
- Test browser zoom at 200% and text enlargement.
- Check for horizontal overflow and clipped focus rings.

Example responsive grid:

```css
.product-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--grid-gap);
}

.product-grid__media {
  grid-column: span 7;
}

.product-grid__content {
  grid-column: span 5;
}

@media (max-width: 800px) {
  .product-grid__media,
  .product-grid__content {
    grid-column: 1 / -1;
  }
}
```

---

## 13. Accessibility requirements

Target **WCAG 2.2 AA** as the baseline.

- Use semantic landmarks: header, nav, main, aside, footer.
- Provide a skip-to-content link.
- Use correct heading hierarchy.
- Ensure all functionality is keyboard-operable.
- Provide visible focus indicators.
- Do not trap keyboard focus outside dialogs.
- Maintain sufficient text and non-text contrast.
- Do not rely on color alone to communicate state.
- Add meaningful alternative text to informative images.
- Use empty alt text for decorative images.
- Provide captions/transcripts for meaningful audio/video.
- Give icon-only controls accessible names.
- Use native controls before custom ARIA widgets.
- Use `aria-live` for relevant asynchronous status updates, not every changing value.
- Respect reduced motion.
- Ensure 200% zoom and reflow do not remove functionality.
- Test with keyboard only and at least one screen reader/browser combination.
- Test focus order, labels, errors, landmarks, and accessible names.

Example:

```jsx
<a className="skip-link" href="#main-content">
  Skip to content
</a>

<header>
  <nav aria-label="Main navigation">{/* Navigation links */}</nav>
</header>

<main id="main-content">
  <h1>Sound that holds the room.</h1>
</main>
```

---

## 14. Performance and Core Web Vitals

Performance is a release requirement, not a later optimization task.

### 14.1 Targets

Use Google's current Core Web Vitals guidance as the reference. Aim for good field performance at the 75th percentile:

- **LCP:** 2.5 seconds or less.
- **INP:** 200 milliseconds or less.
- **CLS:** 0.1 or less.

### 14.2 Images and video

- Use AVIF/WebP with suitable fallbacks where needed.
- Generate responsive image sizes with `srcset` and `sizes`.
- Set `width` and `height` or `aspect-ratio`.
- Lazy-load below-the-fold images.
- Do not lazy-load the primary hero/LCP image.
- Use `fetchpriority="high"` only for the actual critical image.
- Compress assets and remove unused media.
- Prefer video over animated GIF for photographic loops.
- Use `muted`, `playsInline`, and a poster for decorative video.
- Provide a static fallback and honor reduced motion.
- Do not autoplay audio.
- Use CDN delivery for large assets when appropriate.

### 14.3 JavaScript and React

- Code-split routes and heavy interactive components.
- Lazy-load 3D viewers and secondary experiences.
- Keep dependencies lean.
- Avoid expensive synchronous work during render.
- Avoid unnecessary re-renders and context-wide updates.
- Virtualize very large lists.
- Use Web Workers for CPU-heavy tasks when appropriate.
- Avoid excessive event listeners and unthrottled scroll handlers.
- Use `IntersectionObserver` for simple visibility detection rather than continuous scroll polling.
- Profile with React DevTools and browser performance tools.
- Test production builds, not only the development server.

### 14.4 3D and WebGL

- Load 3D only when it adds real product understanding.
- Provide a still image fallback.
- Use compressed models and textures.
- Limit polygon counts, material complexity, and real-time lights.
- Dispose geometries, materials, textures, and renderers on unmount.
- Pause rendering when the scene is off-screen or the page is hidden.
- Cap pixel ratio on high-density devices.
- Avoid making 3D the only way to inspect a product.
- Support drag, touch, keyboard controls, and reset behavior.
- Detect unsupported devices and show a fallback.
- Do not render a continuous animation loop when the scene is static.

---

## 15. SEO, metadata, and content quality

- Use a unique, descriptive `<title>` per route.
- Write a useful meta description.
- Use canonical URLs where appropriate.
- Use semantic HTML and meaningful link text.
- Add Open Graph and social metadata.
- Provide descriptive alt text for content images.
- Use structured data only when it accurately describes the page.
- Ensure important copy exists in HTML, not only inside images or canvas.
- Create a sitemap and robots policy for production.
- Handle 404 pages and redirects correctly.
- Avoid duplicate headings and vague link labels.
- Keep product specifications and claims accurate and traceable.

---

## 16. Security and reliability

- Never expose API secrets in frontend code.
- Validate and sanitize untrusted input on the server.
- Use HTTPS in production.
- Avoid unsafe HTML injection; do not use `dangerouslySetInnerHTML` for untrusted content.
- Configure Content Security Policy where feasible.
- Use secure cookie settings for authentication.
- Apply rate limiting and server-side authorization to sensitive endpoints.
- Do not trust client-side price, role, or permission values.
- Handle network failures, timeouts, and offline states.
- Avoid logging passwords, tokens, personal data, or payment data.
- Keep dependencies updated and review security advisories.
- Use environment variables for configuration, never for secrets exposed to the browser.

---

## 17. Testing and quality gates

### Before merge

- ESLint passes.
- Formatting check passes.
- Production build passes.
- Unit tests cover critical utilities and state logic.
- Component tests cover interactive behavior.
- End-to-end tests cover the primary user journey.
- Keyboard navigation works.
- Reduced-motion mode works.
- No horizontal overflow at supported widths.
- No console errors or failed critical requests.
- Images and fonts load without layout shifts.
- Loading, empty, error, and success states are tested.

### Manual visual review

Review:

- First viewport / hero.
- Navigation open and closed.
- Every primary call to action.
- Every product variant or filter.
- Mid-page section rhythm.
- Footer and final conversion section.
- Mobile and tablet layouts.
- Reduced-motion experience.
- Slow network and low-powered device behavior.

### Suggested tooling

- ESLint + Prettier.
- Vitest + React Testing Library.
- Playwright for end-to-end tests.
- Lighthouse for lab audits.
- Chrome DevTools Performance panel.
- axe DevTools or axe-core for accessibility checks.
- React DevTools Profiler for render analysis.

---

## 18. Recommended project workflow

1. **Understand the goal:** audience, content, conversion, and required functionality.
2. **Research references:** identify patterns, not screenshots to copy.
3. **Define art direction:** type, color, grid, imagery, and motion.
4. **Create design tokens:** centralize values before styling sections.
5. **Map content and routes:** decide the information architecture.
6. **Build semantic static structure:** ensure the site works before animation.
7. **Implement responsive layout:** verify real content at narrow widths.
8. **Add interactions:** forms, selectors, menus, routing, and state.
9. **Add motion:** select the smallest suitable animation toolset.
10. **Add media/3D:** optimize, lazy-load, and provide fallbacks.
11. **Run quality gates:** lint, tests, accessibility, performance, and build.
12. **Polish:** spacing, typography, transitions, responsive edge cases.
13. **Ship and measure:** monitor real user performance and fix regressions.

---

## 19. Final release checklist

### Design
- [ ] The visual direction is coherent and specific to the product.
- [ ] Typography, color, spacing, and layout use shared tokens.
- [ ] Every section has a clear purpose.
- [ ] Content hierarchy is clear without animation.
- [ ] Media has intentional crops and stable dimensions.

### React and code
- [ ] Components have clear responsibilities.
- [ ] State is minimal and correctly scoped.
- [ ] Hooks follow React rules.
- [ ] Effects and subscriptions clean up correctly.
- [ ] No dead code, placeholder actions, or unexplained lint suppressions.
- [ ] Route and error states are complete.

### Motion
- [ ] Every animation has a purpose.
- [ ] One animation owner controls each element.
- [ ] Reduced-motion behavior is implemented.
- [ ] Scroll effects do not hijack navigation.
- [ ] Animations clean up on unmount.
- [ ] Mobile motion is simplified where appropriate.

### Accessibility
- [ ] Keyboard-only navigation works.
- [ ] Focus is visible and correctly managed.
- [ ] Headings and landmarks are semantic.
- [ ] Controls have accessible names and labels.
- [ ] Contrast and zoom/reflow are checked.
- [ ] Images and media have appropriate alternatives.

### Performance and release
- [ ] Hero/LCP media is optimized.
- [ ] Below-fold media is lazy-loaded.
- [ ] 3D and heavy libraries are loaded only when needed.
- [ ] Core Web Vitals are measured.
- [ ] Production build and tests pass.
- [ ] No critical console or network errors.

---

## 20. Official references

Use official documentation as the source of truth when APIs or best practices change.

### React and ESLint
- React Rules: https://react.dev/reference/rules
- React Hooks ESLint plugin: https://react.dev/reference/eslint-plugin-react-hooks
- ESLint getting started: https://eslint.org/docs/latest/use/getting-started

### Animation
- GSAP documentation: https://gsap.com/docs/v3/
- GSAP installation: https://gsap.com/docs/v3/Installation/
- GSAP React integration: https://github.com/greensock/react
- Motion for React: https://motion.dev/docs/react
- Motion documentation: https://motion.dev/docs
- React Spring documentation: https://www.react-spring.dev/docs
- React Spring `useSpring`: https://www.react-spring.dev/docs/components/use-spring

### Design, accessibility, and web platform
- Vercel Web Interface Guidelines: https://vercel.com/design/guidelines
- Chrome Modern Web Guidance: https://developer.chrome.com/docs/modern-web-guidance/guides
- Chrome Accessibility Guidelines: https://developer.chrome.com/docs/modern-web-guidance/guides/accessibility/accessibility
- MDN: https://developer.mozilla.org/
- Web Content Accessibility Guidelines: https://www.w3.org/WAI/standards-guidelines/wcag/

### Inspiration
- Awwwards SOLARA HALO S1: https://www.awwwards.com/sites/solara-halo-s1
- SOLARA HALO S1 preview reference: https://templates-preview.oxvo.app/t/oxvo-original-studio-max-commerce-3d/latest/

---

**Operating principle:** Build the clearest and fastest usable website first. Add expressive art direction and motion only when they strengthen the story, improve feedback, or make the product easier to understand.
