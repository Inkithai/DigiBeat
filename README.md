# DigiBeat - Beautiful Browser-Based Clocks & Timers

<p align="center">
  <img src="public/favicon.svg" width="64" height="64" alt="DigiBeat Logo" />
</p>

<p align="center">
  <strong>DigiBeat</strong> is a stunning collection of browser-based clocks, timers, and time tools. Works fullscreen on any device. No signup, no ads.
</p>

<p align="center">
  <a href="https://github.com/Inkithai/DigiBeat">GitHub</a> •
  <a href="#features">Features</a> •
  <a href="#clock-styles">Clock Styles</a> •
  <a href="#presets">Presets</a> •
  <a href="#sharing">Sharing</a> •
  <a href="#accessibility">Accessibility</a> •
  <a href="#offline">Offline/PWA</a>
</p>

---

## ✨ Features

### Core Features
- 🕐 **Multiple Clock Styles** - Digital, Flip, Pixel, Neon, and Binary displays
- 🌈 **8 Color Themes** - Red, Green, Blue, White, Amber, Purple, Pink, Cyan
- ⏰ **12/24 Hour Format** - Toggle between time formats
- 📅 **Date Display** - Show or hide the current date
- 📺 **Fullscreen Mode** - Immersive clock display for any screen
- 🌙 **Keep Screen Awake** - Prevents display from sleeping (Wake Lock API)
- 💾 **Local Storage** - Preferences saved automatically
- 📱 **Responsive Design** - Works on all devices
- ⚡ **No Install Required** - Runs entirely in your browser

### Time Tools
- ⏱️ **Timer** - Countdown with preset durations
- ⏲️ **Stopwatch** - Track elapsed time with lap support
- 🍅 **Pomodoro Timer** - Focus sessions with breaks
- 🌍 **World Clock** - Compare time across 45+ cities

---

## 🎨 Clock Styles

| Style | Description |
|-------|-------------|
| **Digital** | Classic seven-segment LED display |
| **Flip** | Animated flip-clock with realistic cards |
| **Pixel** | Retro 8-bit pixel art style |
| **Neon** | Glowing neon tube effect with flicker |
| **Binary** | Binary-coded decimal time display |

---

## 🚀 Quick Presets

| Preset | Use Case |
|--------|----------|
| **Default** | General use with all features |
| **Minimal** | OLED-friendly, auto-hide controls, no distractions |
| **Presentation** | Large display for projectors and meetings |
| **Classroom** | Educational settings with date visible |
| **Bedside** | Night-friendly OLED mode, no seconds |
| **Kitchen** | Light theme, quick timer access |
| **Streaming** | OBS-friendly, auto-hide UI, dark theme |

---

## 🎯 Background Themes

- **Dark** - Classic dark mode with subtle gradients
- **OLED Black** - Pure black for battery saving
- **Gradient** - Vibrant purple/pink gradient
- **Light** - Clean light theme

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `F` | Toggle fullscreen |
| `S` | Toggle seconds |
| `D` | Toggle date |
| `T` | Toggle keep screen awake |
| `H` | Toggle high contrast mode |
| `Esc` | Exit fullscreen / close panels |

---

## 🔗 Shareable URLs

Share your exact clock configuration via URL:

```
https://yoursite.com/?color=green&style=neon&format=24&seconds=1&date=1&preset=bedside
```

### URL Parameters

| Parameter | Values | Description |
|-----------|--------|-------------|
| `color` | red, green, blue, white, amber, purple, pink, cyan | Clock color |
| `style` | digital, flip, pixel, neon, binary | Clock style |
| `format` | 12, 24 | Time format |
| `seconds` | 0, 1 | Show/hide seconds |
| `date` | 0, 1 | Show/hide date |
| `keepawake` | 0, 1 | Keep screen on |
| `autohide` | 0, 1 | Auto-hide controls |
| `highcontrast` | 0, 1 | High contrast mode |
| `preset` | default, minimal, presentation, classroom, bedside, kitchen, streaming | Quick preset |
| `bg` | dark, oled, gradient, light | Background theme |

### QR Code Sharing

Generate QR codes to share configurations with others - perfect for classrooms, meeting rooms, and events.

---

## ♿ Accessibility

DigiBeat is built with accessibility in mind:

- **High Contrast Mode** - Toggle for better visibility
- **Reduced Motion** - Respects system preference and toggle
- **Keyboard Navigation** - Full keyboard support
- **Screen Reader Labels** - ARIA labels on all controls
- **Focus Indicators** - Clear visible focus states
- **Font Size Options** - Small, Medium, Large, Extra Large

---

## 📱 Offline / PWA Support

DigiBeat can be installed as a Progressive Web App (PWA):

1. **Add to Home Screen** - Install on mobile/tablet
2. **Offline Support** - Works without internet after first load
3. **Background Sync** - Settings sync automatically
4. **Standalone Mode** - Opens like a native app

### Service Worker Features
- Caches all assets for offline use
- Updates in background when online
- Falls back gracefully when offline

---

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **CSS Variables** - Theming
- **Browser APIs** - Fullscreen, Wake Lock, LocalStorage, Service Worker

---

## 📱 Use Cases

### For Individuals
- ✓ Secondary monitor clock display
- ✓ Bedside clock on tablet
- ✓ Focus/work sessions with Pomodoro
- ✓ Cooking timer in the kitchen

### For Professionals
- ✓ Meeting room display
- ✓ Presentation countdown
- ✓ Classroom timer
- ✓ Stream overlay

### For Teams
- ✓ Remote team coordination (World Clock)
- ✓ Meeting planner across time zones
- ✓ Shared focus sessions

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Inkithai/DigiBeat.git

# Navigate to project
cd DigiBeat

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📄 License

MIT License - feel free to use DigiBeat for any project!

---

## 🙏 Credits

Built with ❤️ for everyone who needs a beautiful clock.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Inkithai">Inkithai</a>
</p>
