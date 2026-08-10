# DigiBeat — AI Features Analysis

> Ground truth first: the current DigiBeat codebase contains **no AI of any kind** — no ML
> libraries, no model API calls, no speech/vision, nothing. Every feature below is a proposal.
> Markers: **EXISTING** (already in code), **PLANNED** (design exists), **RECOMMENDED** (build this).

---

## 1. Feasibility with the Current Stack

| Constraint | Reality | Consequence |
|---|---|---|
| Frontend-only (React SPA, GitHub Pages) | No server to hold API keys | LLM calls must go through a proxy you control; never ship keys in the bundle |
| No backend, no database | No user identity, no history | Most "personalization" AI needs an accounts layer first |
| No analytics | No activity data | "Insights from user activity" is impossible until events are collected |
| Offline-first character | AI APIs are online-only | AI features must degrade gracefully offline |
| Free hosting (GitHub Pages) | No serverless functions | Any AI proxy requires a new hosting tier (Vercel/Netlify/Supabase) |

**Rules that follow:**
1. Build the data layer (accounts + events) before AI that consumes data.
2. Prefer AI that *reduces friction* (voice, NL input, summaries) over AI that *sounds cool*.
3. Keep the LLM behind one server-side proxy route so providers can be swapped and cost capped.
4. Client-side AI (Web Speech API, small on-device models) is real and costs nothing per call —
   use it where it fits.

---

## 2. Feature Catalog

Legend — Complexity: 🟢 low · 🟡 medium · 🔴 high · ⚫ very high.
Cost = typical monthly for a solo app at modest usage, in USD.

### A. Voice-controlled timer & alarms  (RECOMMENDED — build first)

| Aspect | Detail |
|---|---|
| User problem | Setting a timer takes 4+ taps/typing; hands are often busy (cooking, working out) |
| Feature | "Hey DigiBeat, set a timer for 5 minutes" — mic button on Timer/Alarm pages; speech → intent → starts the timer/alarm |
| AI technology | **Web Speech API** (SpeechRecognition, on-device/browser-based — free, no LLM) + small intent parser (regex/rule-based) |
| Complexity | 🟢 Low — browser API + a mapping of phrases to actions; ~2–4 weeks part-time |
| Cost | $0 (no API). Add LLM fallback later if parse quality disappoints |
| Free vs paid | Free (it's a differentiator; not a revenue engine) |
| Revenue potential | Indirect — increases daily usage and retention, feeds the "voice-first timer" story |

### B. Natural-language alarm & schedule creation  (RECOMMENDED)

| Aspect | Detail |
|---|---|
| User problem | "Wake me at 7am on weekdays" is painful in a select-based editor |
| Feature | Free-text field: *"Every weekday 7:00, plus 9:30 Sundays"* → parsed into alarm objects with repeat days |
| AI technology | Small LLM call (gpt-4o-mini / claude-haiku) with JSON-schema output, or an offline rule parser (chrono-node style) |
| Complexity | 🟡 Medium — prompt + schema validation + edge-case handling; LLM route is ~2 weeks |
| Cost | ~$1–5/mo at hobby scale (tiny prompts, low volume) |
| Free vs paid | Free tier (daily limit); unlimited parsing on Pro |
| Revenue potential | Low direct, high activation — one of the most impressive "AI" demos per dollar |

### C. Focus/usage analytics & weekly summary  (RECOMMENDED)

| Aspect | Detail |
|---|---|
| User problem | Users don't know how they actually spend their time; the app forgets everything |
| Feature | Auto-record completed pomodoros, timers, stopwatch sessions; "Your week" — sessions/day, best focus hours, streaks, gentle trends |
| AI technology | **Rule-based statistics + optional LLM summarization** (1 short prompt/week) |
| Complexity | 🟡 Medium — needs accounts + event storage + a stats engine; LLM summary is the small part |
| Cost | ~$1–2/mo (one weekly prompt per active user) |
| Free vs paid | Basic stats free; AI-written weekly insights + PDF export on Pro |
| Revenue potential | **High** — this is the retention engine (the "return loop" the app lacks today) |

### D. Smart Pomodoro / adaptive session planner  (RECOMMENDED)

| Aspect | Detail |
|---|---|
| User problem | Fixed 25/5 ignores how a user actually works (deep-focus users, beginners, ADHD users) |
| Feature | Suggests work/break lengths and long-break timing based on past sessions (completion rate, streak, time of day); "today's plan" generated from calendar hints |
| AI technology | Lightweight heuristics (percentile/bandit logic) or a tiny LLM for plan generation |
| Complexity | 🟡 Medium — mostly data plumbing; the "AI" can be 95% statistics |
| Cost | $0–5/mo |
| Free vs paid | Free (personalization is table stakes) |
| Revenue potential | Retention feature; pairs with premium analytics |

### E. AI focus coach / copilot  (PLANNED — after data exists)

| Aspect | Detail |
|---|---|
| User problem | Motivation and accountability for deep work |
| Feature | Chat panel: "How was my week?", "Plan 4 focus blocks tomorrow", "I keep skipping breaks — what's up?" with conversational answers grounded in the user's actual data |
| AI technology | **RAG-lite**: user stats summarized into context, injected into an LLM chat with system prompt + tool calls (start timer, schedule block) |
| Complexity | 🔴 High — chat UX, context assembly, tool-calling, safety, cost control, rate limits |
| Cost | ~$5–25/mo per active user at conversational volume → **must be paid or quota'd** |
| Free vs paid | Free: 10 messages/mo. Paid: unlimited + priority |
| Revenue potential | **Highest ceiling** but only after (C) exists — an assistant with no memory is a gimmick |

### F. Automatic daily/weekly schedule builder  (PLANNED)

| Aspect | Detail |
|---|---|
| User problem | "What should my day look like?" — planning takes effort |
| Feature | "Build my ideal morning": user sets constraints (start time, meeting-free window, focus goals) → app produces a time-blocked plan that can be exported as .ics |
| AI technology | LLM for natural-language constraints + deterministic calendar solver (interval scheduling) for the actual plan; LLM generates, algorithm validates |
| Complexity | 🟡 Medium (solver) to 🔴 (calendar integration) |
| Cost | ~$2–10/mo |
| Free vs paid | Pro feature (limited plans on free) |
| Revenue potential | Medium — strong for students and solopreneurs |

### G. AI-generated ambient backgrounds / clock skins  (gimmick risk)

| Aspect | Detail |
|---|---|
| User problem | Personalization/novelty |
| Feature | "Describe your background": text → image generation for the clock backdrop |
| AI technology | Image model API (DALL·E/Flux) |
| Complexity | 🟢 Low integration, but content moderation + caching + cost per image |
| Cost | $0.02–0.10 per image → quickly real money |
| Free vs paid | Paid-only (each image is a real cost) |
| Revenue potential | Low-moderate; novelty wears off; use as a Pro perk, not a headline |

### H. AI timezone assistant ("When should we meet?")  (PLANNED)

| Aspect | Detail |
|---|---|
| User problem | World Clock shows times but not *good times to meet* across zones |
| Feature | Select participants' cities + working hours → app proposes overlap windows and converts a proposed time to all zones |
| AI technology | Deterministic overlap math (no LLM needed) — maybe LLM to parse "meeting with NY and Tokyo team" |
| Complexity | 🟢 Low–🟡 Medium |
| Cost | ~$0–2/mo |
| Free vs paid | Free (differentiator for World Clock) |
| Revenue potential | Low direct; increases retention of a currently weak feature |

### I. Predictive usage / churn alerts  (internal, not user-facing)

| Aspect | Detail |
|---|---|
| User problem | (Owner's problem) knowing who will churn |
| Feature | Score users by activity (sessions, features used, streak) to target win-backs |
| AI technology | Logistic regression / gradient boosting on event data (or even rule thresholds) |
| Complexity | 🟡 Medium (needs months of event data first) |
| Cost | ~$0 (compute is trivial at this scale) |
| Free vs paid | Internal |
| Revenue potential | Indirect — better retention campaigns |

### J. Voice announcements & ambient audio  (novelty, low priority)

| Aspect | Detail |
|---|---|
| User problem | Eyes-busy feedback ("pomodoro ended") |
| Feature | Spoken announcements via Speech Synthesis (TTS) at session boundaries; ambient soundscapes |
| AI technology | Web Speech Synthesis (free, on-device) |
| Complexity | 🟢 Low |
| Cost | $0 |
| Free vs paid | Free |
| Revenue potential | Negligible; nice polish |

### K. Smart alarm ("sleep-aware")  (⚠️ gimmick)

| Aspect | Detail |
|---|---|
| User problem | Alarms that wake you mid-cycle are brutal |
| Feature | Alarm adjusts within a window based on "sleep stage" inferred from… what? No wearable data source exists in the app |
| AI technology | Would need wearable/phone sensor integration (HealthKit, Fitbit API) |
| Complexity | ⚫ Very high (sensor integrations, privacy, permissions) |
| Cost | High (integrations + model) |
| Free vs paid | Paid-only |
| Revenue potential | Would be a hit *if* it worked, but it's a different product category (sleep app) — **do not build** |

### L. LLM-powered "What should I work on?"  (gimmick without data)

| Aspect | Detail |
|---|---|
| User problem | Task triage |
| Feature | Chat suggests what to work on next |
| AI technology | LLM |
| Complexity | 🟡 |
| Cost | ~$5–20/mo |
| Free vs paid | Paid |
| Revenue potential | Low — there are 100 to-do apps with this; DigiBeat has no task data and no authority here. **Skip unless the app grows a task list.** |

### M. On-device "digital wellness" nudges  (PLANNED)

| Aspect | Detail |
|---|---|
| User problem | Screen-time awareness (this is a *screen-time* app in disguise) |
| Feature | After N focus sessions or hours, gentle break reminders with a bit of personalization; "you focus best between 9–11" |
| AI technology | Rule-based + simple stats; optional LLM wording |
| Complexity | 🟢 Low |
| Cost | ~$0–2/mo |
| Free vs paid | Free |
| Revenue potential | Retention support |

### N. Premium analytics dashboard (team/enterprise)  (RECOMMENDED for B2B later)

| Aspect | Detail |
|---|---|
| User problem | A studio/school wants aggregate focus-room usage, exports, reports |
| Feature | Dashboard: usage by room/device, session logs, CSV exports, white-label |
| AI technology | Statistics + optional LLM executive summaries |
| Complexity | 🔴 High (org accounts, roles, billing, reporting) |
| Cost | ~$20–100/mo server-side (small) |
| Free vs paid | Paid (Team/Business plans) |
| Revenue potential | The **most defensible revenue line** once orgs exist — see monetization doc |

---

## 3. Cost Reality Check

Assumptions: hobby app, 10k MAU, each active user triggers a handful of AI calls.

| Feature | Calls/user/mo | Cost/user/mo | 10k MAU cost/mo |
|---|---|---|---|
| NL alarm parsing (mini LLM) | 30 | ~$0.002 | ~$20 |
| Weekly LLM summary | 4 | ~$0.004 | ~$40 |
| Focus coach chat (Pro only, 200 msgs) | 200 | ~$0.20–1.00 | revenue-covered |
| Image backgrounds (paid, 5 images) | 5 | ~$0.25–0.50 | revenue-covered |
| Voice (Web Speech, on-device) | ∞ | $0.000 | $0 |

**Rule of thumb:** anything that calls an LLM more than ~50×/user/mo must be behind the paywall
or quota, or it will eat the entire (currently $0) margin. On-device AI stays free forever.

---

## 4. Recommended AI Roadmap (gated on product steps)

| Step | Product prerequisite | AI feature |
|---|---|---|
| 1 | — (no account needed) | Voice timer/alarm (A), NL alarm parsing (B), TTS announcements (J) |
| 2 | Accounts + event capture | Focus analytics + weekly LLM summary (C), smart pomodoro (D) |
| 3 | Retention proven | AI coach (E), schedule builder (F), timezone assistant (H) |
| 4 | Paying users exist | AI backgrounds (G, paid), premium analytics (N), churn scoring (I) |
| Never | — | Sleep-stage alarms (K), generic task copilot (L) |

## 5. What Counts as AI Here — Honest Note

Most of the *valuable* features above (C, D, H, M) are 90% deterministic statistics and 10%
LLM. That's the right ratio: the LLM writes the summary and parses the sentence; the app's own
logic does the actual work. Resist the temptation to make everything a chat — the strongest
AI feature for DigiBeat is a **weekly summary in the user's own words**, generated from data
the app actually owns.
