# DigiBeat — Design Patterns Documentation

This document catalogs the patterns actually present in the DigiBeat source (verified), assesses
whether each is implemented correctly, and explains how to read patterns out of the codebase.

> Markers: **EXISTING** (in code today), **PLANNED** (next), **RECOMMENDED** (long-term).

---

## 1. Pattern Inventory (Current Codebase)

### 1.1 Provider Pattern (React Context)

- **Where:** `src/ClockContext.tsx` — `ClockProvider` wraps the whole app in `App.tsx`;
  consumed via the custom `useClock()` hook.
- **Why:** App-wide settings (color, style, format, toggles) are needed by nearly every
  component; prop drilling would be unmanageable.
- **Advantages:** Single source of truth; trivial to consume; centralizes persistence,
  URL parsing, wake lock, and auto-hide side effects.
- **Disadvantages:** Any context change re-renders every consumer; global state encourages
  putting non-global things in it.
- **Correctness:** ✅ Implemented correctly — typed context, `useClock()` guards against
  missing provider, settings updates are immutable (`{...prev, ...updates}`).
- **Minor issues:** (1) `useClock()` is called *inside* the `handleKeyDown` callback in
  `Home.tsx` — works at runtime but violates Rules of Hooks and is a readability trap;
  (2) the context object holds wake-lock state that only Home uses; (3) the same effect
  `document.documentElement.setAttribute('data-bg', …)` is copy-pasted into all six pages.

### 1.2 Custom Hook Pattern

- **Where:** `src/hooks/useTime.ts` — `useTime`, `useTimer`, `useStopwatch`, `usePomodoro`.
- **Why:** Encapsulates ticking/time math so pages stay declarative; hooks are the idiomatic
  React way to share non-visual logic.
- **Advantages:** Each hook is self-contained and unit-testable; pages are thin.
- **Disadvantages:** The four hooks live in one file named `useTime.ts` (misleading);
  timer logic uses `setInterval` with a 1s tick whose accuracy drifts (intervals can
  stretch under load).
- **Correctness:** ✅ Good separation. ⚠️ `useTimer`'s effect depends on `totalSeconds`,
  recreating the interval every tick — works but is wasteful; a single interval reading a
  deadline timestamp would be more accurate and cheaper.

### 1.3 Strategy Pattern (renderer selection)

- **Where:** `Home.tsx` `renderClock()` — a `switch (settings.style)` returns
  `SimpleDigital | FlipClockDisplay | PixelClockDisplay | NeonClockDisplay | BinaryClockDisplay`.
- **Why:** Each clock style is an interchangeable rendering strategy selected by one setting.
- **Advantages:** Adding a new style is one case + one component; each renderer is isolated.
- **Disadvantages:** The switch is centralized; the factory list grows; type safety is
  manual (a missed case silently falls to `default`).
- **Correctness:** ✅ Works. Improvement (RECOMMENDED): replace the switch with a
  `Record<ClockStyle, ComponentType>` registry map (`CLOCK_RENDERERS`) — same strategy
  pattern, less boilerplate, type-safe.

### 1.4 Configuration-Object / Data-Driven Pattern

- **Where:** `types.ts` — `PRESETS`, `COLORS`, `HIGH_CONTRAST_COLORS`, `BACKGROUND_THEMES`,
  `CITIES` as typed records/arrays.
- **Why:** UI options are data, so rendering loops and validators are generated from the
  same source; single place to extend.
- **Advantages:** Adding a color/preset/city is a one-line data change; URL validation
  reuses the same lists.
- **Disadvantages:** Some data is duplicated (e.g., settings panel re-declares the list of
  styles/colors as local arrays rather than importing from `types.ts`).
- **Correctness:** ✅ Mostly correct. ⚠️ `COLORS[color as keyof typeof COLORS]` casts in
  AlarmClock's ToggleSwitch indicate weak typing in a spot where types should flow naturally.

### 1.5 Observer Pattern (subscriptions via useEffect)

- **Where:** visibility change → wake lock re-request; `online`/`offline` events → offline
  indicator; `mousemove`/`mouseleave` → auto-hide; `keydown` → shortcuts; `setInterval` → ticks.
- **Why:** The browser is the source of truth for time, connectivity, and focus.
- **Advantages:** Idiomatic React; cleanup functions are consistently used
  (no leaked listeners found).
- **Disadvantages:** Subscriptions are scattered across `ClockContext`, `Home`, and each
  page, making behavior hard to trace.
- **Correctness:** ✅ Correct with proper cleanup. ⚠️ Auto-hide logic lives inside the
  provider (a UI concern) rather than a dedicated hook or component.

### 1.6 CSS-Variables Theming

- **Where:** `styles.css` `:root` + `[data-bg="oled|gradient|light"]` overrides; `data-high-contrast`
  attribute toggling.
- **Why:** Theme switching without re-rendering; cheap, composable, fast.
- **Advantages:** Clean; works with the dark-first aesthetic; PWA-friendly.
- **Disadvantages:** Many components bypass the variables and inline hardcoded colors
  (e.g., `rgba(20,20,35,…)` everywhere), so "theming" is only skin-deep — the light theme
  still shows dark glass panels with white text in places.
- **Correctness:** ⚠️ Partially. The variable system is right, but inline styles override
  the intent in ~40% of components (there is no design-token discipline).

### 1.7 Modal/Overlay Pattern

- **Where:** SettingsPanel `ShareModal`, AlarmClock `AlarmEditor` — fixed inset-0 overlay +
  backdrop blur + `e.stopPropagation()` to prevent close-on-click-inside.
- **Why:** Focused secondary tasks (share, edit alarm) without navigation.
- **Advantages:** Consistent look; simple implementation.
- **Disadvantages:** No focus trap, no Escape-to-close, no scroll lock, no `role="dialog"`
  with `aria-modal` (SettingsPanel's panel has `role="dialog"` but the modals don't).
- **Correctness:** ⚠️ Functional but incomplete a11y. RECOMMENDED: extract a reusable
  `<Modal>` component with focus trap + Escape handling.

### 1.8 Duplicate Implementation (anti-pattern)

- **Where:** `ToggleSwitch` exists twice — `SettingsPanel.tsx` (label+switch, keyboard
  support, `role="switch"`) and `AlarmClock.tsx` (switch only, no keyboard handler, colors
  via type-cast).
- **Why it happens:** No shared component library; copy-paste convenience.
- **Cost:** Divergent behavior and accessibility; double maintenance.
- **Correctness:** ❌ Should be one shared `components/ToggleSwitch.tsx`.

### 1.9 Singleton Data Constants

- **Where:** `COLORS`, `PRESETS`, `CITIES`, `BACKGROUND_THEMES` — module-level immutable
  consts imported everywhere.
- **Correctness:** ✅ Appropriate — pure configuration data. `CITIES` (47 entries) is
  reasonable as a static list; it becomes a DB concern only when users need custom cities.

### 1.10 Adapter Pattern

- **Where:** `Intl.DateTimeFormat` / `toLocaleString(timeZone)` in WorldClock and
  DateDisplay; `navigator.wakeLock`; `navigator.clipboard`; `navigator.serviceWorker`.
- **Why:** The browser API surface is normalized into the app's needs.
- **Correctness:** ✅ With graceful fallbacks (`--:--:--`, clipboard execCommand fallback,
  `unsupported` wake-lock status).

---

## 2. Pattern-by-Pattern Assessment Table

| # | Pattern | Location | Implemented correctly? | Keep? | Change to? |
|---|---|---|---|---|---|
| 1 | Provider/Context | ClockContext | ✅ (2 smells) | Keep | Split wake-lock into its own provider |
| 2 | Custom hooks | useTime.ts | ✅ | Keep | Rename file; deadline-based timer |
| 3 | Strategy (switch) | Home.tsx | ✅ | Keep | Registry map `Record<ClockStyle, Component>` |
| 4 | Config objects | types.ts | ✅ (dupe lists) | Keep | Single source of truth for style/color lists |
| 5 | Observer | contexts/pages | ✅ | Keep | Move auto-hide to a hook |
| 6 | CSS variables | styles.css | ⚠️ partial | Keep | Enforce tokens; audit inline colors |
| 7 | Modal overlay | 2 places | ⚠️ a11y gaps | Keep | Reusable `<Modal>` with focus trap |
| 8 | ToggleSwitch | duplicated | ❌ | Fix | Extract shared component |
| 9 | Singleton consts | types.ts | ✅ | Keep | — |
| 10 | Adapter | Intl/WakeLock/etc. | ✅ | Keep | — |

**Overall verdict:** The architecture is small, coherent, and maintainable for its size.
The dominant risks are not design patterns — they are *missing* layers: no tests, no
component library, no i18n, no analytics, no data model.

---

## 3. Patterns to Introduce (RECOMMENDED)

| Pattern | For | Priority |
|---|---|---|
| **Repository/Service layer** | Wrap localStorage + future API in one module (`settingsRepo`, `alarmRepo`, later `syncRepo`) so the backend swap doesn't touch components | High |
| **Feature modules** | Group `pomodoro/` as folder with hook + components + tests instead of page monoliths | Medium |
| **Design tokens** | `tokens.ts` exporting color/space/radius/typography; kill magic `rgba(20,20,35,…)` | Medium |
| **Component library** | Shared `Button`, `ToggleSwitch`, `Modal`, `Select`, `SegmentedControl` — 80% of current UI is these | High |
| **State machine** | Timer/Pomodoro have distinct states (idle/running/paused/complete) — `xstate` or a plain reducer with explicit states prevents edge bugs | Low-Medium |
| **Test patterns** | Vitest + React Testing Library for hooks (timer math) and components (clock renderers) | High |
| **Feature flags** | Once premium exists, flag gating without redeploys | Medium |
| **Analytics events** | `track('timer.completed', {duration})` funnel — needs a tiny analytics module (PostHog) | High |

---

## 4. How to Identify Patterns (Methodology with DigiBeat Examples)

### Q31 — Identifying design patterns from the UI

Look for recurring interaction and layout structures:

| Look for | DigiBeat example |
|---|---|
| Repeated button styles | `Button` variants (primary/secondary/danger) in every page → "button component" pattern |
| Repeated toggle switches | ToggleSwitch in Settings + Alarm editor → "switch control" pattern (and its duplication!) |
| Overlays that block the page | Share modal, Alarm editor → "modal" pattern |
| A persistent settings surface | Right-side drawer → "settings panel" pattern |
| Navigation repeated on every page | `Navigation` component in all 6 headers → "top nav" pattern |
| Instant apply + persistence | Any change applies immediately and survives reload → "live-settings + local persistence" pattern |
| Segmented choice groups | Preset/style/color/format chips → "segmented control / option group" pattern |

### Q32 — Identifying design patterns from source code

1. **Scan imports** — repeated imports reveal shared components (`Button` imported by 4 pages).
2. **Look for `useState`/`useEffect` at the top of files** — reveals hook usage.
3. **Find `createContext`** — reveals the Provider pattern.
4. **Find repeated JSX blocks** — reveals components that should exist (or the ToggleSwitch duplication).
5. **Find `switch` statements over a type union** — reveals Strategy-like dispatch (`renderClock`).
6. **Find giant object literals of configuration** — reveals config-object patterns (`PRESETS`, `COLORS`).
7. **Find `localStorage.getItem/setItem` pairs** — reveals persistence patterns.

### Q33 — Identifying architectural patterns from a codebase

| Signal | Reads as |
|---|---|
| Single entry (`main.tsx`), router, no server calls | **Client-only SPA architecture** |
| One global context + localStorage | **Local-state-first architecture** (no backend) |
| `pages/` + `components/` + `hooks/` folders | **Layered/folders-by-type architecture** |
| Every page does the same `useEffect(setAttribute)` | **Missing shared layout/theme concern** (cross-cutting behavior duplicated) |
| No `env` usage, no fetch calls | **Zero-integration architecture** |
| Service worker + manifest | **PWA architecture** |

### Q34 — Design pattern vs. design style

- **Design pattern** = a *reusable solution structure*: how components are composed, how
  state flows, how data persists. It answers *"how is it built?"*
- **Design style** = the *visual language*: neon glow, glassmorphism, Orbitron font, dark
  theme, glow shadows. It answers *"how does it look?"*
- **DigiBeat example:** The "modal" pattern (overlay + backdrop + close handlers) is a
  design pattern; the frosted-glass dark panel with the green glow is the design style.
  You can replace the style (light theme) without touching the pattern.

### Q35 — Reverse-engineering the architecture of an existing website

1. **Open DevTools → Network** — list every request: JS/CSS assets → build stack; API calls
   → backend existence. DigiBeat: only static assets + fonts + qrserver → no backend.
2. **Open the JS bundle** — search for `localStorage`, `fetch(`, `WebSocket`, `api.` to
   find persistence and integrations. DigiBeat: `localStorage` keys `digibeat-settings`,
   `digibeat-alarms`; no fetch.
3. **Check `document.cookie` / storage tab** — identifies auth and session handling.
   DigiBeat: none.
4. **Inspect the DOM tree** — repeated class names reveal the component library.
   DigiBeat: `.clock-container`, `.header`, `.clock-wrapper` → custom layout.
5. **Read `package.json`/lockfile** (when open source) — the fastest, most accurate signal.
6. **Check the manifest + service worker** — PWA capabilities. DigiBeat: offline-cache SW.
7. **Probe behavior** — reload (settings persist?), go offline (still works?), two devices
   (state differs?) → confirms client-only vs backend-backed. DigiBeat: persists locally,
   works offline, does NOT sync across devices.

---

## 5. Maintainability Assessment

| Dimension | Score (1–5) | Notes |
|---|---|---|
| Readability | 4 | Clear naming, small components, consistent structure |
| Testability | 1 | Zero tests; logic buried in hooks is *easy* to test once harness added |
| Extensibility | 3 | Adding clock styles/presets is trivial; adding backend/sync touches everything |
| Consistency | 2 | Duplicated ToggleSwitch, inline styles vs CSS vars, copy-pasted theme effects |
| Accessibility | 3 | Good ARIA/keys on some controls, gaps in modals and animations |
| Observability | 1 | No analytics, no error tracking, no logging |
| Build/CI hygiene | 2 | tsc+build works, but no CI, no lint, no tests |

**Bottom line:** this is a well-written small app that is ready for its next structural step —
introduce a repository layer, a shared component library, and tests *before* adding the
backend, so the backend lands on stable ground.
