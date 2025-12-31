"use client";

type Insight = {
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
};

type InsightsPanelProps = {
  insights: Insight[];
  recommendations: string[];
};

const severityMap = {
  low: { label: "Low", color: "#047857", background: "rgba(16, 185, 129, 0.12)" },
  medium: { label: "Medium", color: "#b45309", background: "rgba(251, 191, 36, 0.15)" },
  high: { label: "High", color: "#b91c1c", background: "rgba(248, 113, 113, 0.16)" },
};

export function InsightsPanel({ insights, recommendations }: InsightsPanelProps) {
  return (
    <section className="card" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div>
        <h2 className="section-title">Agent Signals</h2>
        <p className="section-subtitle">Quick scan of risks and opportunities surfaced from attendance + payroll data.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {insights.map((insight) => {
          const palette = severityMap[insight.severity];
          return (
            <div key={insight.title} className="card" style={{ margin: 0, background: "#f8fafc" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                <div>
                  <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>{insight.title}</h3>
                  <p style={{ margin: 0, color: "#475569", fontSize: "14px" }}>{insight.description}</p>
                </div>
                <span
                  className="tag"
                  style={{
                    background: palette.background,
                    color: palette.color,
                    fontSize: "12px",
                  }}
                >
                  {palette.label} risk
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <h3 style={{ margin: "0 0 10px", fontSize: "16px" }}>Recommended Actions</h3>
        <ol style={{ margin: 0, paddingLeft: "20px", color: "#475569", fontSize: "14px" }}>
          {recommendations.map((action) => (
            <li key={action} style={{ marginBottom: "8px" }}>
              {action}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
