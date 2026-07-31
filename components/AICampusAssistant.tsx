"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** If the AI mentions a location, it may include a flyTo action */
  flyToAction?: { lat: number; lng: number; name: string };
  isStreaming?: boolean;
}

interface AICampusAssistantProps {
  onFlyTo?: (lat: number, lng: number, name: string) => void;
}

const SUGGESTED_QUERIES = [
  "Where is the library?",
  "Find the nearest dining hall",
  "Which dorm is closest to the pool?",
  "Where can I print documents?",
  "How do I get to the admin block?",
];

/** Extract flyTo JSON block from AI response text */
function extractFlyTo(text: string): { cleanText: string; flyToAction?: { lat: number; lng: number; name: string } } {
  const match = text.match(/\{"action":"flyTo","lat":(-?\d+\.?\d*),"lng":(-?\d+\.?\d*),"name":"([^"]+)"\}/);
  if (match) {
    return {
      cleanText: text.replace(match[0], "").trim(),
      flyToAction: { lat: parseFloat(match[1]), lng: parseFloat(match[2]), name: match[3] },
    };
  }
  return { cleanText: text };
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}

export default function AICampusAssistant({ onFlyTo }: AICampusAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
      setHasNewMessage(false);
    }
  }, [isOpen, messages, scrollToBottom]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const safeId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const userMsg: Message = { id: safeId, role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const assistantMsgId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setMessages((prev) => [
      ...prev,
      { id: assistantMsgId, role: "assistant", content: "", isStreaming: true },
    ]);

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), history: messages.slice(-8) }),
      });

      if (!res.ok) throw new Error("Request failed");
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, content: fullText, isStreaming: true }
              : m
          )
        );
        scrollToBottom();
      }

      // Final: extract flyTo, strip from text
      const { cleanText, flyToAction } = extractFlyTo(fullText);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? { ...m, content: cleanText, flyToAction, isStreaming: false }
            : m
        )
      );

      if (!isOpen) setHasNewMessage(true);
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? { ...m, content: "Sorry, I couldn't reach the assistant. Please try again.", isStreaming: false }
            : m
        )
      );
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestion = (q: string) => {
    sendMessage(q);
  };

  return (
    <>
      {/* FAB Button */}
      <div
        style={{ position: "absolute", bottom: 160, right: 16, zIndex: 1000 }}
        onMouseDown={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Close AI assistant" : "Open AI campus assistant"}
          className={`relative w-10 h-10 rounded-xl shadow-lg border border-white/[0.08] flex items-center justify-center transition-all ${
            isOpen
              ? "bg-blue-500 text-white"
              : "bg-[#1a1a2e]/90 backdrop-blur-xl text-gray-300 hover:text-white hover:bg-[#1a1a2e]"
          }`}
        >
          {isOpen ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          )}
          {hasNewMessage && !isOpen && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-blue-400 border border-[#1a1a2e]" />
          )}
        </button>
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <div
          style={{ position: "absolute", bottom: 216, right: 16, zIndex: 1000, width: "min(380px, calc(100vw - 32px))" }}
          onMouseDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          role="dialog"
          aria-label="AI Campus Assistant"
        >
          <div className="bg-[#13151f]/98 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
            style={{ height: 460 }}>

            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07] shrink-0">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <p className="text-white text-xs font-bold">Campus Assistant</p>
                <p className="text-gray-500 text-[10px]">Powered by AI · MSU Gweru</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                {messages.length > 0 && (
                  <button
                    onClick={() => setMessages([])}
                    title="Clear conversation"
                    aria-label="Clear chat history"
                    className="text-[10px] text-gray-400 hover:text-white px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                  >
                    Clear
                  </button>
                )}
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 custom-scrollbar">
              {messages.length === 0 && (
                <div className="py-2">
                  <p className="text-xs text-gray-500 mb-3">Ask me anything about the campus:</p>
                  <div className="flex flex-col gap-1.5">
                    {SUGGESTED_QUERIES.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSuggestion(q)}
                        className="text-left text-xs text-gray-300 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] transition-all hover:text-white"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] ${msg.role === "user" ? "order-1" : "order-2"}`}>
                    <div className={`px-3 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white rounded-br-md"
                        : "bg-white/[0.06] text-gray-200 rounded-bl-md"
                    }`}>
                      {msg.isStreaming && !msg.content ? (
                        <TypingIndicator />
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                      {msg.isStreaming && msg.content && (
                        <span className="inline-block w-1.5 h-3.5 bg-current opacity-70 ml-0.5 animate-pulse align-middle" />
                      )}
                    </div>
                    {/* Show on Map button */}
                    {msg.flyToAction && !msg.isStreaming && (
                      <button
                        onClick={() => onFlyTo?.(msg.flyToAction!.lat, msg.flyToAction!.lng, msg.flyToAction!.name)}
                        className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors px-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        📍 Show on Map — {msg.flyToAction.name}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.06] rounded-2xl rounded-bl-md">
                    <TypingIndicator />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="px-3 py-3 border-t border-white/[0.07] flex gap-2 shrink-0">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about any building or place…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-blue-500/40 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="w-8 h-8 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:bg-white/[0.07] disabled:text-gray-600 text-white flex items-center justify-center transition-all active:scale-95 shrink-0"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
