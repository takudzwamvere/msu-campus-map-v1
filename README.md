# MSU Campus Map — Revolutionary Edition

This is an interactive, modern campus map application for Midlands State University (Gweru Main Campus), built with [Next.js](https://nextjs.org) and [Leaflet](https://leafletjs.com/). Designed to assist students, faculty, staff, and visitors with navigation, class scheduling, AI assistance, and real-time campus awareness.

---

## 🚀 Key Features & Capabilities

- **📱 Progressive Web App (PWA)**: Offline tile caching via Workbox, Web App Manifest, offline fallback screen, PWA install prompt, and API route caching.
- **⌨️ Keyboard Shortcuts & Accessibility**: Press `⌘K` or `/` to focus search; press `?` for hotkey reference modal; full `Escape` key dismiss support across all panels & forms.
- **🏛️ Rich Building Detail Panels**: Slide-in info drawer with opening hours, capacity utilization meters, amenities chips (Wi-Fi, Wheelchair Accessibility, Floor counts), safe clipboard sharing, and keyboard focus management.
- **🤖 Streaming AI Campus Assistant**: Intelligent conversational assistant powered by AI with campus knowledge graph integration that auto-pans and highlights destinations.
- **📅 Timetable Manager & JSON Export**: Class schedule manager with day filtering, walking distance alerts, countdown timers, and full `.json` schedule export / backup.
- **🔥 Anonymous Crowdedness Heatmap**: Privacy-first opt-in presence signals aggregated into dynamic heatmaps.
- **📍 Quick Campus View Reset**: One-tap recenter control button to restore camera focus to main campus grounds.
- **🤝 Student Community Contributions**: Community tips, opening hour updates, and crowd alerts with voting feedback.
- **🎉 Geo-Pinned Campus Events**: Live event pins (academic, social, sports, ceremonies) with direct map popups.
- **⚠️ Safety Incident Reporting**: Interactive hazard pin dropping (lighting, path obstruction, flooding) with auto-expiring markers.
- **🏢 3D Perspective Mode**: CSS 3D extrusion perspective toggle with SVG polygon building footprints.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `⌘ K` / `/` | Focus campus search bar |
| `?` | Toggle keyboard shortcuts modal |
| `Esc` | Close drawers, modals, or clear active route |
| `+` / `-` | Zoom in / out on interactive map |

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript & React 19
- **Styling**: Tailwind CSS v4 with custom dark mode glassmorphism
- **Maps Engine**: Leaflet, React Leaflet, Leaflet Routing Machine, `leaflet-heat`
- **PWA Engine**: `@ducanh2912/next-pwa` & Workbox

---

## ⚙️ Environment Configuration

Copy `.env.local.example` to `.env.local`:

```env
# Optional Supabase Integration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional Gemini AI Assistant Integration
GEMINI_API_KEY=your-gemini-key

# Optional PWA Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-key
```

---

## 💻 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/takudzwamvere/msu-campus-map-v1.git
   cd msu-campus-map-v1
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Development Mode**:
   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   npm run start
   ```

---

<p align="center">
  Built with ❤️ for the Midlands State University Community
</p>
