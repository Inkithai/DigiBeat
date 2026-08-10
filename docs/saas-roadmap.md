# DigiBeat — SaaS Roadmap

> Honest framing: DigiBeat today is a free, static, client-only time-tools web app with
> zero revenue surface. The roadmap below turns it into a SaaS **without destroying** what
> makes it good: instant, free, no-signup, offline-capable. Sign-in must always be optional.

Prioritization scoring used below (1–5, 5 = best):
**UV** user value · **RE** revenue potential · **CA** competitive advantage · **TC** technical complexity (5 = simplest) · **EFF** dev effort (5 = smallest)

---

## Phase 1 — Current MVP: Harden & Polish  *(now)*

**Goal:** fix verified defects, make the existing product trustworthy, add observability.

| Item | Type | UV | RE | CA | TC | EFF | Why |
|---|---|---|---|---|---|---|---|
| Fix PWA manifest (SVG icons, correct start_url) | bug | 3 | 1 | 1 | 5 | 5 | Install prompts broken today |
| Replace duplicated ToggleSwitch; shared Button/Modal components | refactor | 2 | 0 | 1 | 4 | 4 | Reduces future cost of every feature |
| Add Vitest + RTL tests for hooks and clock renderers | quality | 2 | 0 | 1 | 4 | 4 | Timer math bugs are the #1 trust killer |
| GitHub Actions CI (typecheck, test, build, deploy) | infra | 2 | 0 | 1 | 5 | 5 | Zero CI today |
| Add analytics (PostHog): page views, timer starts/completions, settings usage | data | 3 | 3 | 2 | 4 | 4 | **Without this, no later phase can be data-driven** |
| Fix Pomodoro: configurable durations + real long break; fix snooze behavior | product | 4 | 1 | 2 | 3 | 4 | README promises it; users will notice |
| Escape/scroll-lock on modals, fix pulse animations under reduced motion | a11y | 3 | 0 | 1 | 5 | 5 | Cheap credibility |
| i18n groundwork (string extraction) | infra | 3 | 2 | 2 | 3 | 3 | en-US-only today; most clocks users are global |

**Exit criteria:** CI green, tests covering core hooks, analytics live, all §7 defects from
`architecture.md` closed.

---

## Phase 2 — User Growth & Retention  *(1–3 months)*

**Goal:** make users *come back*. A clock/timer is a session tool; history and sync turn it
into a habit tool.

| Item | UV | RE | CA | TC | EFF | Priority |
|---|---|---|---|---|---|---|
| Optional accounts (magic-link, Supabase) — anonymous mode stays | 5 | 4 | 3 | 2 | 2 | 🔴 P0 |
| Focus session history (pomodoro/timer completions recorded server-side) | 5 | 4 | 4 | 2 | 2 | 🔴 P0 |
| Settings + alarms cloud sync across devices | 5 | 3 | 3 | 2 | 2 | 🔴 P0 |
| Saved timer presets (named, reusable) | 4 | 2 | 2 | 5 | 4 | 🟠 P1 |
| Weekly summary email/page (plain stats — AI later) | 5 | 3 | 4 | 3 | 3 | 🟠 P1 |
| World Clock improvements: DST-safe custom cities, "best time to meet" | 4 | 1 | 3 | 3 | 3 | 🟠 P1 |
| Streaks & gentle goals (daily focus minutes) | 4 | 2 | 3 | 4 | 4 | 🟠 P1 |
| Export CSV of focus history | 3 | 2 | 2 | 4 | 4 | 🟡 P2 |
| Web Push notifications for alarms/pomodoro when tab closed | 4 | 3 | 3 | 2 | 2 | 🟠 P1 (trust-building) |

**KPI:** 30-day retention > 20% (vs ~near-zero today), signup conversion of active users > 15%.

---

## Phase 3 — AI  *(2–4 months after Phase 2 data)*

**Goal:** AI that *reads the data Phase 2 collects*. See `ai-features.md` for full detail.

| Feature | UV | RE | CA | TC | EFF | Priority |
|---|---|---|---|---|---|---|
| Voice timer/alarm (Web Speech, on-device, $0) | 4 | 1 | 4 | 5 | 4 | 🔴 P0 |
| NL alarm/schedule parsing (mini-LLM, JSON-schema) | 4 | 2 | 3 | 4 | 3 | 🔴 P0 |
| AI weekly summary (LLM over user's own stats) | 5 | 4 | 5 | 3 | 3 | 🔴 P0 |
| Smart pomodoro (adaptive durations from history) | 4 | 2 | 3 | 4 | 3 | 🟠 P1 |
| TTS session announcements (on-device) | 2 | 0 | 1 | 5 | 5 | 🟡 P2 |
| AI coach chat (only after summary proves value) | 4 | 5 | 4 | 1 | 1 | 🟠 P1 (quota'd, Pro) |
| Timezone "when to meet" helper | 3 | 1 | 3 | 4 | 3 | 🟡 P2 |
| AI-generated backgrounds | 2 | 3 | 1 | 4 | 2 | 🟡 P2 (paid only) |

**Exit criteria:** ≥30% of active users open the weekly summary; summary open-rate measurable
in analytics; AI features used >5×/mo by >25% of actives.

---

## Phase 4 — Monetization  *(alongside Phase 3; AI is the anchor)*

**Goal:** first revenue. See `monetization.md` for pricing.

| Item | UV | RE | CA | TC | EFF | Priority |
|---|---|---|---|---|---|---|
| Stripe Checkout + Customer Portal + webhooks | 1 | 5 | 1 | 3 | 3 | 🔴 P0 (infra) |
| Pro tier: sync, history, AI summary, AI coach quota, exports | 5 | 5 | 4 | 3 | 3 | 🔴 P0 |
| Team/Classroom tier: org accounts, rooms, shared timers, admin dashboard | 4 | 5 | 4 | 1 | 1 | 🟠 P1 |
| White-label embeddable clock widget (iframe/script) for sites | 4 | 4 | 3 | 3 | 3 | 🟠 P1 |
| Public API (time utilities, focus stats, webhook events) | 3 | 4 | 2 | 2 | 2 | 🟡 P2 |
| Enterprise: SSO, audit logs, priority support | 2 | 5 | 2 | 1 | 1 | 🟡 P2 |

**Exit criteria:** ≥2% free→paid conversion of active users; MRR > $500 with churn < 5%/mo.

---

## Phase 5 — SaaS Infrastructure  *(before scaling)*

| Component | Choice | Purpose |
|---|---|---|
| Backend | Supabase (Postgres + Auth + RLS) or Next.js API routes | Auth, sync, billing webhooks, AI proxy |
| Billing | Stripe | Subscriptions, portal, invoices |
| AI proxy | Serverless function wrapping LLM provider | Key safety, quotas, logging, provider swap |
| Queues | Upstash/Redis or Postgres-based queue | Weekly summaries, push digests, webhook fan-out |
| Email | Resend/Postmark | Magic links, weekly summary |
| Push | Web Push + VAPID (browser native) | Alarm delivery while closed |
| Observability | PostHog (product) + Sentry (errors) | Funnels, crash-free rate |
| Hosting | Vercel/Netlify (frontend + functions) | Replace GitHub Pages at this point |

Security requirements at this phase: RLS on all user data, API rate limiting, secrets in
env (never client), PII minimization (time data is sensitive), deletion API (GDPR/CCPA).

---

## Phase 6 — Scale  *(thousands → millions of users)*

| Concern | Today | Needed at scale |
|---|---|---|
| Hosting | GitHub Pages static | CDN + edge functions (Vercel/Cloudflare) |
| Database | none | Postgres with connection pooling (pgBouncer/Supabase pooler), read replicas |
| Auth | none | Session caching, SSO (Enterprise), MFA |
| Billing | none | Metered usage tiers, annual invoicing, VAT/tax handling |
| AI cost | none | Per-user quotas, provider fallback, caching of repeated prompts, batch summaries |
| Analytics | none | Privacy-compliant funnel analytics, retention cohorts |
| Abuse | none | Rate limiting, bot detection on signup/API |
| Support | none | Help center, status page, SLA (Enterprise) |
| Architecture | one SPA | Micro-frontends NOT needed; keep monolith, split modules: focus-stats service, billing service, ai service, widget service |

**Scale principle:** keep the core as a single small service as long as possible; split only
when deploys or load demand it. A clock app's backend is tiny — the cost center is AI,
which is why quotas and caching are the first scale investment.

---

## Global Priority Matrix (top 12 work items across phases)

| Rank | Item | Phase | UV | RE | CA | TC | EFF |
|---|---|---|---|---|---|---|---|
| 1 | Analytics (PostHog) | 1 | 3 | 3 | 2 | 4 | 4 |
| 2 | Optional accounts + cloud sync | 2 | 5 | 4 | 3 | 2 | 2 |
| 3 | Focus history capture | 2 | 5 | 4 | 4 | 2 | 2 |
| 4 | Voice timer/alarm | 3 | 4 | 1 | 4 | 5 | 4 |
| 5 | AI weekly summary | 3 | 5 | 4 | 5 | 3 | 3 |
| 6 | Stripe billing + Pro tier | 4 | 1 | 5 | 1 | 3 | 3 |
| 7 | Web Push alarms | 2 | 4 | 3 | 3 | 2 | 2 |
| 8 | Shared component library + tests | 1 | 2 | 0 | 1 | 4 | 4 |
| 9 | NL alarm parsing | 3 | 4 | 2 | 3 | 4 | 3 |
| 10 | Pomodoro config + long break | 1 | 4 | 1 | 2 | 3 | 4 |
| 11 | Team/Classroom tier | 4 | 4 | 5 | 4 | 1 | 1 |
| 12 | Embeddable widget | 4 | 4 | 4 | 3 | 3 | 3 |

**Sequencing logic:** data (1) → accounts+history (2,3) → retention loop (7) → AI on that data
(4,5,9) → billing + paid tiers (6) → B2B surfaces (11,12).
