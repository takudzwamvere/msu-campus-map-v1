/**
 * presence.ts
 * Anonymous presence signal utilities for the crowdedness heatmap.
 * Uses sessionStorage for a session-scoped anonymous ID.
 */

const SIGNAL_INTERVAL_MS = 60_000; // 60 seconds
let intervalId: ReturnType<typeof setInterval> | null = null;

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem("msu-presence-id");
    if (!id) {
      // Generate a random ID — no PII, no persistent tracking
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem("msu-presence-id", id);
    }
    return id;
  } catch {
    // sessionStorage unavailable (e.g. private browsing with strict settings)
    return "anon-" + Math.random().toString(36).slice(2);
  }
}

export async function reportPresence(lat: number, lng: number): Promise<void> {
  try {
    await fetch("/api/presence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: getSessionId(), lat, lng }),
    });
  } catch {
    // Silently fail — presence signals are best-effort
  }
}

/**
 * Start sending periodic presence signals.
 * Call when user has opted in and GPS is available.
 */
export function startPresence(getCoords: () => [number, number] | null): void {
  stopPresence(); // Clear any existing interval

  const send = async () => {
    const coords = getCoords();
    if (coords) await reportPresence(coords[0], coords[1]);
  };

  // Send immediately
  send();
  intervalId = setInterval(send, SIGNAL_INTERVAL_MS);
}

/**
 * Stop sending presence signals.
 */
export function stopPresence(): void {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

/**
 * Check if active presence signal reporting is currently running.
 */
export function isPresenceActive(): boolean {
  return intervalId !== null;
}
