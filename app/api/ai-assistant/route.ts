import { NextRequest, NextResponse } from "next/server";
import { buildCampusContext } from "@/lib/ai-context";

// ── Types ──────────────────────────────────────────────────────────────────
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ── Mock response engine ───────────────────────────────────────────────────
// TODO: Replace with real Gemini API call when GEMINI_API_KEY is available.
// Wire-up guide:
//   1. npm install @google/generative-ai
//   2. Replace the mock block below with:
//      const { GoogleGenerativeAI } = await import("@google/generative-ai");
//      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
//      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//      const chat = model.startChat({ history: [...], systemInstruction: systemPrompt });
//      const result = await chat.sendMessageStream(userMessage);
//      const stream = new ReadableStream({ ... pull from result.stream ... });

const MOCK_RESPONSES: Record<string, string> = {
  library: `The MSU Main Library is located near the centre of campus. It's open Mon–Fri 8:00–22:00, Sat 9:00–17:00, and Sun 14:00–20:00 with 600-person capacity, study rooms, printing, and Wi-Fi. {"action":"flyTo","lat":-19.51320,"lng":29.83580,"name":"MSU Main Library"}`,
  library_short: `The MSU Main Library has 4 floors with silent zones, research databases, and printing. {"action":"flyTo","lat":-19.51320,"lng":29.83580,"name":"MSU Main Library"}`,
  dining: `The Main Dining Hall is the primary cafeteria on campus, serving over 800 students. Open Mon–Fri 7:00–20:00, weekends 8:00–18:00. Meal cards and cashless payment accepted. {"action":"flyTo","lat":-19.51400,"lng":29.83610,"name":"Main Dining Hall"}`,
  dorm: `Several dormitory blocks are available on campus. The China dormitory complex (A–G) houses female students in the northern section. Male dormitories are located in the south-eastern area. {"action":"flyTo","lat":-19.51170,"lng":29.83609,"name":"China A"}`,
  print: `You can print at the MSU Main Library (all floors) and the ICT Complex. The ICT Complex has computer labs with high-speed internet, open Mon–Fri 7:30–21:00. Note: labs can get full before 10:00. {"action":"flyTo","lat":-19.51280,"lng":29.83640,"name":"ICT Complex"}`,
  admin: `The Administration Block handles student records, finance, and the Registrar. It's open Mon–Fri 8:00–16:30 and has 3 floors. {"action":"flyTo","lat":-19.51350,"lng":29.83550,"name":"Administration Block"}`,
  pool: `The Swimming Pool is open Mon–Fri 7:00–12:00 and 14:00–18:00 with a lifeguard on duty. The MSU Sports Complex is nearby with a gym and weights room. {"action":"flyTo","lat":-19.51480,"lng":29.83680,"name":"Swimming Pool"}`,
  health: `The Student Health Centre offers general consultations, a pharmacy, and 24/7 emergency care. Open Mon–Fri 8:00–17:00. For after-hours emergencies, contact Campus Security. {"action":"flyTo","lat":-19.51300,"lng":29.83590,"name":"Student Health Centre"}`,
  sports: `The MSU Sports Complex is open Mon–Sat 6:00–21:00 and Sun 8:00–18:00, featuring a gymnasium, weights room, and changing facilities. {"action":"flyTo","lat":-19.51450,"lng":29.83670,"name":"MSU Sports Complex"}`,
  default: `I can help you navigate MSU Gweru campus. Try asking me about the library, dining hall, dormitories, ICT lab, admin block, sports complex, swimming pool, or health centre. I can also give you directions and opening hours.`,
};

function mockResponse(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("librar")) return MOCK_RESPONSES.library;
  if (m.includes("print") || m.includes("ict") || m.includes("comput")) return MOCK_RESPONSES.print;
  if (m.includes("dine") || m.includes("dining") || m.includes("food") || m.includes("eat") || m.includes("cafet") || m.includes("canteen")) return MOCK_RESPONSES.dining;
  if (m.includes("dorm") || m.includes("hostel") || m.includes("china") || m.includes("sleep") || m.includes("room") || m.includes("accommod")) return MOCK_RESPONSES.dorm;
  if (m.includes("admin") || m.includes("registrar") || m.includes("record") || m.includes("finance")) return MOCK_RESPONSES.admin;
  if (m.includes("pool") || m.includes("swim")) return MOCK_RESPONSES.pool;
  if (m.includes("health") || m.includes("clinic") || m.includes("sick") || m.includes("doctor") || m.includes("pharmacy")) return MOCK_RESPONSES.health;
  if (m.includes("sport") || m.includes("gym") || m.includes("exercise") || m.includes("fitness")) return MOCK_RESPONSES.sports;
  if (m.includes("timetable") || m.includes("class") || m.includes("schedule") || m.includes("lecture")) {
    return `You can use the Timetable Manager tool from the main sidebar to add your class schedule and get navigation routes straight to your lectures!`;
  }
  return MOCK_RESPONSES.default;
}

// ── API Route ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { message, history = [] }: { message: string; history: ChatMessage[] } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // Build context (used for logging / future Gemini integration)
    const _systemPrompt = buildCampusContext();
    void _systemPrompt; // suppress unused warning in mock mode

    const responseText = mockResponse(message);

    // Stream the response character by character to simulate real AI streaming
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const words = responseText.split("");
        for (const char of words) {
          controller.enqueue(encoder.encode(char));
          // Simulate streaming delay — remove when using real Gemini stream
          await new Promise((r) => setTimeout(r, 8));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-MSU-AI-Mode": "mock", // Remove header when using real AI
      },
    });
  } catch (err) {
    console.error("[ai-assistant] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
