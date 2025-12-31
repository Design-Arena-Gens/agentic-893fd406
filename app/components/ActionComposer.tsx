"use client";

import { useState } from "react";

type ActionComposerProps = {
  defaultSubject: string;
  defaultBody: string;
};

export function ActionComposer({ defaultSubject, defaultBody }: ActionComposerProps) {
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Clipboard error", error);
    }
  };

  return (
    <section className="card" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 className="section-title">Escalation Draft</h2>
          <p className="section-subtitle">Tweak the agent-prepared message before sharing with finance or leadership.</p>
        </div>
        <button className="button" onClick={handleCopy} style={{ padding: "10px 16px" }}>
          {copied ? "Copied" : "Copy to Clipboard"}
        </button>
      </div>
      <label style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>
        Subject
        <input className="input" value={subject} onChange={(event) => setSubject(event.target.value)} style={{ marginTop: "6px" }} />
      </label>
      <label style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>
        Message
        <textarea
          className="input"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          style={{ marginTop: "6px", minHeight: "160px" }}
        />
      </label>
    </section>
  );
}
