/**
 * push-notifications.ts
 * Helper functions for registering service worker push subscriptions
 * and scheduling local/push notifications for timetable events.
 */

export function getNotificationSupportStatus(): { supported: boolean; permission: NotificationPermission } {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return { supported: false, permission: "denied" };
  }
  return { supported: true, permission: Notification.permission };
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  if (Notification.permission === "granted") {
    return "granted";
  }
  return await Notification.requestPermission();
}

export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  const permission = await requestNotificationPermission();
  if (permission !== "granted") return null;

  try {
    const registration = await navigator.serviceWorker.ready;
    const existing = await registration.pushManager.getSubscription();
    if (existing) return existing;

    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) {
      console.warn("[push] NEXT_PUBLIC_VAPID_PUBLIC_KEY missing. Local notifications only.");
      return null;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey) as unknown as BufferSource,
    });

    await fetch("/api/push-subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });

    return subscription;
  } catch (err) {
    console.error("[push] Failed to subscribe to push:", err);
    return null;
  }
}

export async function scheduleLocalNotification(title: string, body: string, delayMs: number): Promise<void> {
  const permission = await requestNotificationPermission();
  if (permission !== "granted") return;

  setTimeout(async () => {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      registration.showNotification(title, {
        body,
        icon: "/icons/icon-192.png",
        badge: "/icons/icon-72.png",
        data: { url: "/" },
      });
    } else {
      new Notification(title, { body, icon: "/icons/icon-192.png" });
    }
  }, Math.max(0, delayMs));
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
