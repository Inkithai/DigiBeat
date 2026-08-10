# DigiBeat — User Flow Documentation

> Status markers:
> - **EXISTING** — flow works today in the deployed app
> - **PLANNED** — designed, not built
> - **RECOMMENDED** — long-term target

---

## 1. Flow Inventory (Current)

| # | Flow | Status | Entry point | Exit point |
|---|---|---|---|---|
| F1 | New visitor (first page load) | EXISTING | Any URL | Starts using a tool or leaves |
| F2 | First-time configuration | EXISTING | Settings button | Clock customized, optionally shared |
| F3 | Returning user (same browser) | EXISTING | Any URL | Settings restored automatically |
| F4 | Clock display session | EXISTING | Home `/` | Fullscreen / offline / leave |
| F5 | Timer session | EXISTING | `/timer` | Completion ("TIME'S UP!") |
| F6 | Stopwatch session | EXISTING | `/stopwatch` | Laps recorded / reset |
| F7 | Alarm setup + trigger | EXISTING | `/alarm` | Alarm rings → snooze/dismiss |
| F8 | Pomodoro session | EXISTING | `/pomodoro` | Focus/break cycles |
| F9 | World clock comparison | EXISTING | `/world-clock` | City list customized |
| F10 | Settings change | EXISTING | Settings panel | Change applied + persisted |
| F11 | Share clock (URL + QR) | EXISTING | Share modal | URL copied / QR scanned |
| F12 | Authentication | PLANNED | — | — |
| F13 | Premium upgrade | PLANNED | — | — |
| F14 | Subscription management/cancel | PLANNED | — | — |

---

## 2. Flow Diagrams

### 2.1 New Visitor (EXISTING)

```mermaid
flowchart TD
    A["Visitor arrives (any route)"] --> B{"Route?"}
    B -->|"/"| C["Clock page renders instantly<br/>(no login, no signup)"]
    B -->|"/timer | /stopwatch | /alarm | /pomodoro | /world-clock"| D["Tool page renders"]
    C --> E["Sees animated clock + nav + settings"]
    E --> F{"Intrigued?"}
    F -->|Yes| G["Opens Settings → explores presets/styles/colors"]
    F -->|No| H["Leaves (bounce)"]
    G --> I["Clock customized → 'Share Clock'"]
    I --> J["QR / URL shared with others"]
    G --> K["Keeps using (timer, pomodoro…)"]
```

**Friction points (verified):** no onboarding, no "what is this" copy, no account incentive,
no call to action, no analytics to know where visitors drop.

### 2.2 First-Time Configuration (EXISTING)

```mermaid
flowchart TD
    A["User clicks ⚙ Settings"] --> B["Panel opens (fixed right drawer)"]
    B --> C["Choose preset (7 options)"] --> D["Apply preset: style, bg, font size, toggles"]
    B --> E["Choose style: digital/flip/pixel/neon/binary"]
    B --> F["Choose color (8), background (4), format, font size"]
    B --> G["Toggle: seconds, date, wake lock, auto-hide, contrast, motion"]
    D & E & F & G --> H["Every change persists to localStorage instantly"]
    H --> I["Optional: Share Clock → QR/URL"]
```

### 2.3 Returning User (EXISTING)

```mermaid
flowchart TD
    A["User revisits (same browser/device)"] --> B["ClockProvider mounts"]
    B --> C["Reads digibeat-settings from localStorage"]
    C --> D["Merges with defaults; URL params override"]
    D --> E["Clock renders in last-used style instantly"]
    E --> F["Alarms rehydrated from digibeat-alarms"]
    F --> G["Alarm checks resume (fires at set times if page open)"]
```

**Limitations:** on a new device or after clearing storage, the user starts from scratch.
There is no account to restore state. Alarms only fire while the tab/app is open and the
device is awake — no push notifications exist.

### 2.4 Main Feature Usage

```mermaid
flowchart LR
    subgraph Clock["Clock (Home)"]
        C1["useTime tick (1s)"] --> C2["renderClock() by style"]
        C2 --> C3["Fullscreen (F) / Wake lock (T) / Hide UI"]
    end
    subgraph Timer["Timer"]
        T1["Preset or custom minutes (1-999)"] --> T2["Countdown (1s tick)"]
        T2 -->|"reaches 0"| T3["TIME'S UP! + pulse"]
        T3 --> T4["Reset / set new time"]
    end
    subgraph Stopwatch["Stopwatch"]
        S1["Start / pause / resume"] --> S2["Lap capture (cumulative + delta)"]
        S2 --> S3["Reset clears laps"]
    end
    subgraph Alarm["Alarm"]
        A1["Add alarm (time, label, repeat days)"] --> A2["Every-second check"]
        A2 -->|"match + enabled"| A3["WebAudio beep + alert card"]
        A3 --> A4["Snooze 5min / Dismiss"]
    end
    subgraph Pomodoro["Pomodoro"]
        P1["Start focus (25m)"] --> P2["Auto-switch break (5m)"]
        P2 --> P3["Session counter increments"]
        P3 --> P1
    end
    subgraph World["World Clock"]
        W1["Search 47 cities"] --> W2["Add/remove cities"]
        W2 --> W3["Live time + day offset (Today/Tomorrow/Yesterday)"]
    end
```

### 2.5 Settings (EXISTING)

```mermaid
flowchart TD
    A["Settings button"] --> B{"controlsVisible?"}
    B -->|"auto-hide active + idle 5s"| C["⚙ floating button appears"]
    C --> D["Click → panel reopens"]
    B -->|"visible"| D
    D --> E["Edit any setting"]
    E --> F["updateSettings() → re-render + persist"]
    F --> G["Keyboard shortcuts work on Home: F/S/D/T/H"]
```

### 2.6 Authentication (PLANNED)

```mermaid
flowchart TD
    A["User taps 'Sign in'"] --> B["Magic link email OR OAuth (Google/GitHub)"]
    B --> C["Supabase Auth issues session"]
    C --> D["JWT stored (httpOnly cookie or short-lived token)"]
    D --> E["Settings + alarms + focus stats pulled from user row"]
    E --> F["Local edits → debounced sync to API"]
    F --> G["Cross-device continuity achieved"]
```

Design intent: **auth is optional**. Anonymous use stays fully functional; sign-in unlocks
sync, history, and premium features. This preserves the zero-friction character of the tool.

### 2.7 Premium Upgrade (PLANNED)

```mermaid
flowchart TD
    A["Free user hits premium feature (e.g., saved focus history)"] --> B["Upgrade modal (value-led copy)"]
    B --> C["Stripe Checkout (monthly/annual)"]
    C --> D["Stripe webhook → entitlement flag on user row"]
    D --> E["Feature unlocks immediately (realtime or on next fetch)"]
    E --> F["Billing managed via Stripe Customer Portal"]
```

### 2.8 Subscription Cancellation (PLANNED)

```mermaid
flowchart TD
    A["User opens 'Manage subscription'"] --> B["Stripe Customer Portal"]
    B --> C["Cancel at period end (no immediate lockout)"]
    C --> D["Webhook → plan downgraded to Free"]
    D --> E["Paid features downgrade; data retained (read-only) or export offered"]
    E --> F["Win-back: survey + retention offer (pause, not cancel)"]
```

---

## 3. User Experience Observations (Verified)

### 3.1 What works well

- **Instant, frictionless start** — no signup, no loading screens, works offline.
- **Consistent visual language** — one neon/glassmorphism aesthetic across all tools.
- **Keyboard-first clock** — shortcuts make the ambient display usable from a distance.
- **Presets** compress a 15-option config into one tap (strong onboarding device).
- **PWA + fullscreen + wake lock** — the "ambient display" use case is genuinely solved.

### 3.2 What hurts retention (honest assessment)

1. **No reason to return.** A clock/timer is a *session* tool, not a *habit* tool. Without
   history, streaks, saved timers, or sync, there is no pull back.
2. **No cross-device continuity.** Everything lives in one browser's localStorage.
3. **Alarms are unreliable as an alarm.** They fire only when the page is open and the
   screen awake — no notifications, no background delivery.
4. **No feedback loop.** The developer cannot see sessions, so the product cannot improve.
5. **World Clock and Pomodoro are fixed-config.** Pomodoro cannot set work/break durations
   or long breaks; World Clock city list resets per browser.
6. **No export.** Focus history, laps, and settings can't be exported or shared as data.
7. **Language/UX hardcoded to English** and en-US locale.

### 3.3 Recommended future flows (priority order)

| Flow | Status | Why |
|---|---|---|
| Anonymous → signed-in upgrade path | PLANNED | Unlocks sync/history/billing without hurting adoption |
| Focus session history + weekly summary | PLANNED | Creates the "return" loop |
| Saved timer presets (named) | PLANNED | Removes setup friction for the most common action |
| Web Push alarm delivery | RECOMMENDED | Makes the alarm feature actually trustworthy |
| Onboarding tour (3 steps) | RECOMMENDED | Reduces drop-off on first visit |
