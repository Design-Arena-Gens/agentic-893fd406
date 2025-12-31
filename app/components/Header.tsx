"use client";

import { useMemo } from "react";

export function Header() {
  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date()),
    []
  );

  return (
    <header style={{ marginBottom: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
        <div>
          <div className="badge">Agent Workspace</div>
          <h1 style={{ fontSize: "34px", margin: "12px 0 6px", fontWeight: 800 }}>
            HR Attendance & Payroll Command Center
          </h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: "16px", maxWidth: "620px" }}>
            Automate daily attendance reconciliation, payroll readiness checks, and workforce health insights in a single collaborative cockpit.
          </p>
        </div>
        <div className="card" style={{ width: "280px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ fontSize: "14px", color: "#475569", fontWeight: 600 }}>Today</span>
          <strong style={{ fontSize: "20px" }}>{today}</strong>
          <span style={{ fontSize: "13px", color: "#64748b" }}>
            Agent auto-refreshes data every 15 minutes. Last manual check in <strong style={{ color: "#0f172a" }}>~2m ago.</strong>
          </span>
          <button className="button" style={{ alignSelf: "flex-start", padding: "10px 14px" }}>
            Refresh Agent Snapshot
          </button>
        </div>
      </div>
    </header>
  );
}
