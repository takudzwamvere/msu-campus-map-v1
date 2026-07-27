# MSU Campus Map — Revolutionary Edition

This is an interactive, open-source campus map for Midlands State University, built with [Next.js](https://nextjs.org) and [Leaflet](https://leafletjs.com/). Designed to help students, staff, and visitors navigate the Gweru main campus with ease.

---

## 🚀 Revolutionary Features

- **📱 Offline PWA Support**: Workbox service worker tile caching, full Web App Manifest, offline fallback page, and instant install prompt.
- **🏛️ Rich Building Detail Panels**: Slide-in details with opening hours, occupancy capacity bars, amenities chips (Wi-Fi, Accessibility, Floors), and admin notes.
- **🤖 AI Campus Assistant**: Streaming AI chat widget with full campus context that answers location questions and directly pans/highlights points on the map.
- **🔥 Crowdedness Heatmap**: Anonymous presence signal collection and 30m grid bucketization rendering real-time crowd heatmaps.
- **📅 Student Timetable & Class Alerts**: Class schedule manager with manual entry, day filtering, live countdowns, and walking distance arrival alerts.
- **🤝 Crowdsourced Building Data**: Community tips, opening hour updates, and crowd warnings with upvoting and moderation stubs.
- **🎉 Geo-Pinned Campus Events**: Real-time event markers (academic, sports, social, ceremonies) with popups and `.ics` calendar downloads.
- **⚠️ Safety Incident Reporter**: Drop-pin safety hazard reporting (lighting, flooding, path hazards) with auto-expiring 48-hour markers and community confirmations.
- **🏢 3D Building Extrusions**: CSS 3D perspective transform mode with SVG polygon overlays for major campus building footprints at high zoom levels.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Frontend**: [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Mapping & Overlays**: [React Leaflet](https://react-leaflet.js.org/), `leaflet-heat`, [Leaflet Routing Machine](https://www.liedman.net/leaflet-routing-machine/)
- **PWA Engine**: `@ducanh2912/next-pwa` & Workbox

---

## ⚙️ Environment Variables

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

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

<p align="center">
  Built with ❤️ for the MSU Community
</p>
