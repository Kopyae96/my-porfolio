"use client";

import { FormEvent, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const starters = ["What does Pyae do at Micron?", "What are his core strengths?", "Tell me about his career journey."];

export default function DigitalTwinChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: "Hi — I’m Pyae’s Digital Twin. Ask me about his career, technical strengths, or experience." }]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function ask(question: string) {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || status === "loading") return;

    const nextMessages = [...messages, { role: "user" as const, content: cleanQuestion }];
    setMessages(nextMessages);
    setInput("");
    setStatus("loading");

    try {
      const response = await fetch("/api/digital-twin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await response.json() as { reply?: string; error?: string };
      if (!response.ok || !data.reply) throw new Error(data.error ?? "Request failed");
      setMessages((current) => [...current, { role: "assistant", content: data.reply! }]);
      setStatus("idle");
    } catch (error) {
      console.error(error);
      setMessages((current) => [...current, { role: "assistant", content: "I’m unable to answer just now. Please try again shortly." }]);
      setStatus("error");
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void ask(input); }

  return <div className="twin-wrap">
    {open && <section className="twin-panel" aria-label="Pyae Thi La Digital Twin chat">
      <header className="twin-header"><div><p className="eyebrow">Digital Twin</p><h2>Career concierge</h2></div><button type="button" className="twin-close" onClick={() => setOpen(false)} aria-label="Close chat">×</button></header>
      <div className="twin-messages" aria-live="polite">{messages.map((message, index) => <p className={`twin-message twin-message--${message.role}`} key={`${message.role}-${index}`}>{message.content}</p>)}{status === "loading" && <p className="twin-thinking">Thinking…</p>}</div>
      {messages.length === 1 && <div className="twin-starters">{starters.map((starter) => <button type="button" key={starter} onClick={() => void ask(starter)}>{starter}</button>)}</div>}
      <form className="twin-form" onSubmit={submit}><label className="sr-only" htmlFor="twin-question">Ask about Pyae’s career</label><input id="twin-question" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about Pyae’s career…" maxLength={1000} disabled={status === "loading"} /><button type="submit" disabled={!input.trim() || status === "loading"}>Send ↗</button></form>
    </section>}
    <button type="button" className="twin-trigger" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-controls="digital-twin-chat"><span>✦</span> Ask the Digital Twin</button>
  </div>;
}
