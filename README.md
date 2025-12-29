# MSU Campus Map

This is an interactive, open-source campus map for Midlands State University, built with [Next.js](https://nextjs.org) and [Leaflet](https://leafletjs.com/). Designed to help students, staff, and visitors navigate the campus with ease, helping them find buildings, facilities, and getting turn-by-turn directions. So far the only included campus is the Gweru main campus, more features and capuses will be added as the project grows.

## Key Features

- **Interactive Map**: Seamlessly pan, zoom, and explore the detailed campus layout.
- **Smart Search**: Quickly find buildings and locations by name, type, or description.
- **Turn-by-Turn Navigation**: Get precise routing instructions from your current location (or the Main Gate for those who use the site off campus) to any selected destination.
<img width="1365" height="701" alt="location-rate-limiting" src="https://github.com/user-attachments/assets/8dfbf185-f677-49f0-aa26-cde86aafb41d" />

- **Multiple Map Styles**: Switch between **Standard** (OpenStreetMap), **Satellite** (Esri World Imagery), and **Minimal** (CartoDB) views to suit your preference.
<img width="1363" height="696" alt="landing-layer" src="https://github.com/user-attachments/assets/05ba0229-848a-4208-bbd1-aff58ba2102f" />
<img width="1363" height="696" alt="map-layer" src="https://github.com/user-attachments/assets/bcf7fc18-6d89-4881-b765-704d75287479" />
<img width="1365" height="701" alt="minimal-layer" src="https://github.com/user-attachments/assets/93b3aef8-2afa-4928-b52f-3ff88b23ef56" />

- **Mobile First Design**: A fully responsive interface that provides a native-app-like experience on smartphones.

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
