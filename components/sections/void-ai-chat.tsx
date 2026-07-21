"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { voidCevap, type VoidReply } from "@/lib/void-assistant";

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  suggestions?: string[];
  action?: { label: string; href: string };
}

let idc = 0;
const nextId = () => `m${idc++}`;

/** "**kalın**" ve satır sonlarını basit React düğümlerine çevirir. */
function renderText(text: string) {
  return text.split("\n").map((line, li) => (
    <span key={li} className="block">
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, pi) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={pi} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={pi}>{part}</span>
        )
      )}
    </span>
  ));
}

const GREETING: ChatMessage = {
  id: nextId(),
  role: "ai",
  text: "Merhaba! 👋 Ben VOID'in dijital asistanıyım. Projeniz için buradayım — hizmetler, fiyatlar veya süreç hakkında sorabilirsiniz.",
  suggestions: ["Fiyatlar nasıl?", "Hangi hizmetleri veriyorsunuz?", "Ne kadar sürede biter?"],
};

export default function VoidAiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing, open]);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const userMsg: ChatMessage = { id: nextId(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    const reply: VoidReply = voidCevap(trimmed);
    // İnsana benzer bir gecikme (uzunlukla ölçekli, üst sınırlı).
    const delay = Math.min(1400, 500 + reply.text.length * 8);
    const t = setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "ai",
          text: reply.text,
          suggestions: reply.suggestions,
          action: reply.action,
        },
      ]);
    }, delay);
    timers.current.push(t);
  }

  return (
    <>
      {/* Açma/kapama butonu (WhatsApp'ın üstünde) */}
      <motion.button
        type="button"
        aria-label={open ? "Asistanı kapat" : "Asistanı aç"}
        onClick={() => setOpen((v) => !v)}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, type: "spring", stiffness: 200, damping: 15 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="group fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-[0_8px_30px_-6px_rgba(139,92,246,0.7)]"
      >
        {!open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-violet-500 opacity-20" />
        )}
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span key="b" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="relative">
              <Bot size={24} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Sohbet paneli */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-40 right-6 z-40 flex h-[520px] max-h-[calc(100vh-11rem)] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/95 shadow-2xl backdrop-blur-xl"
          >
            {/* Başlık */}
            <div className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-violet-600/20 to-blue-600/20 px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-white">
                <Sparkles size={16} />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">VOID Asistan</p>
                <p className="flex items-center gap-1.5 text-xs text-white/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  Çevrimiçi
                </p>
              </div>
              <button
                type="button"
                aria-label="Kapat"
                onClick={() => setOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mesajlar */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((msg) => (
                <div key={msg.id} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div className={msg.role === "user" ? "max-w-[85%]" : "max-w-[90%]"}>
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                          : "border border-white/10 bg-white/[0.04] text-white/85"
                      }`}
                    >
                      {renderText(msg.text)}
                    </div>

                    {msg.action && (
                      <a
                        href={msg.action.href}
                        onClick={() => setOpen(false)}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition-transform hover:scale-105"
                      >
                        {msg.action.label}
                      </a>
                    )}

                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {msg.suggestions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => send(s)}
                            className="rounded-full border border-violet-400/30 bg-violet-500/5 px-3 py-1 text-xs text-violet-200 transition-colors hover:border-violet-400/60 hover:bg-violet-500/15"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-white/50"
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Girdi */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-white/10 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Bir mesaj yazın..."
                className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-violet-400/50"
              />
              <button
                type="submit"
                aria-label="Gönder"
                disabled={!input.trim() || typing}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white transition-transform hover:scale-105 disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
