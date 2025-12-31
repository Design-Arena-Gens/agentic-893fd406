"use client";

type TimelineItem = {
  time: string;
  title: string;
  description: string;
  owner: string;
  status: "pending" | "in-progress" | "done";
};

const statusColor: Record<TimelineItem["status"], string> = {
  done: "#047857",
  "in-progress": "#2563eb",
  pending: "#b45309",
};

export function OperationsTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <section className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 className="section-title">Ops Timeline</h2>
          <p className="section-subtitle">Agent accountability view for the rest of the week.</p>
        </div>
        <button className="button" style={{ padding: "10px 16px" }}>
          Generate Compliance Pack
        </button>
      </div>
      <div className="timeline">
        {items.map((item) => (
          <div key={item.title} className="timeline-item">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
              <div>
                <strong style={{ fontSize: "15px" }}>{item.time} · {item.title}</strong>
                <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#475569" }}>{item.description}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ display: "block", fontSize: "13px", color: "#475569", fontWeight: 600 }}>{item.owner}</span>
                <span
                  className="badge"
                  style={{
                    background: `${statusColor[item.status]}22`,
                    color: statusColor[item.status],
                    marginTop: "6px",
                  }}
                >
                  {item.status === "done" ? "Completed" : item.status === "in-progress" ? "In progress" : "Queued"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
