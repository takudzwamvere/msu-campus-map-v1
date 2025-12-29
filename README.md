# MSU Campus Map

An interactive, open-source campus map for Midlands State University, built with [Next.js](https://nextjs.org) and [Leaflet](https://leafletjs.com/). Designed to help students, staff, and visitors navigate the campus with ease, helping them find buildings, facilities, and getting turn-by-turn directions.

## Features

- 🗺️ **Interactive Map**: Seamlessly pan, zoom, and explore the detailed campus layout.
- 🔍 **Smart Search**: Quickly find buildings by name, type, or description.
- 🏷️ **Category Filtering**: Filter locations by specific types such as _Academic_, _Sports_, _Residence_, _Dining_, and more.
- 📍 **Turn-by-Turn Navigation**: Get precise routing instructions from your current location (or the Main Gate) to any selected destination.
- 🎨 **Multiple Map Styles**: Switch between **Standard** (OpenStreetMap), **Satellite** (Esri World Imagery), and **Minimal** (CartoDB) views to suit your preference.
- 📱 **Mobile First Design**: A fully responsive interface that provides a native-app-like experience on smartphones.

## Tech Stack

This project leverages modern web technologies to deliver a fast and robust mapping experience:

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Frontend Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Mapping**: [React Leaflet](https://react-leaflet.js.org/) & [Leaflet](https://leafletjs.com/)
- **Routing**: [Leaflet Routing Machine](https://www.liedman.net/leaflet-routing-machine/)

## Getting Started

To run this project locally on your machine, follow these steps:

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/takudzwamvere/msu-campus-map-v1.git
    cd msu-campus-map-v1
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Run the development server**:

    ```bash
    npm run dev
    ```

4.  **Open the application**:
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Resources & Credits

This project makes use of several open-source resources and data providers:

- **Map Data**: © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright).
- **Satellite Imagery**: Tiles © [Esri](https://www.esri.com/) — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community.
- **Minimal Tiles**: © [CartoDB](https://carto.com/attributions).

---

<p align="center">
  Built with ❤️ for the MSU Community
</p>
