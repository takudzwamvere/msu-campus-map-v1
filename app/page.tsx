import MapCaller from "@/components/MapCaller";
import MapOverlay from "@/components/MapOverlay";

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden relative">
      <MapOverlay />
      <MapCaller />
    </main>
  );
}
