"use client";

interface HighlightCardProps {
  label: string;
  primary: string;
  secondary: string;
  trendLabel: string;
  trendValue: string;
  trendPositive?: boolean;
}

function HighlightCard({
  label,
  primary,
  secondary,
  trendLabel,
  trendValue,
  trendPositive = true,
}: HighlightCardProps) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <span style={{ fontSize: "13px", fontWeight: 600, color: "#64748b" }}>{label}</span>
      <strong style={{ fontSize: "30px" }}>{primary}</strong>
      <span style={{ fontSize: "15px", color: "#334155" }}>{secondary}</span>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", color: "#64748b" }}>
        <span>{trendLabel}</span>
        <span style={{ color: trendPositive ? "#047857" : "#b91c1c", fontWeight: 600 }}>{trendValue}</span>
      </div>
    </div>
  );
}

interface DashboardHighlightsProps {
  totalEmployees: number;
  presentToday: number;
  attendanceRate: number;
  payrollReadyPercentage: number;
  pendingAlerts: number;
}

export function DashboardHighlights({
  totalEmployees,
  presentToday,
  attendanceRate,
  payrollReadyPercentage,
  pendingAlerts,
}: DashboardHighlightsProps) {
  return (
    <section className="grid three" style={{ marginBottom: "32px" }}>
      <HighlightCard
        label="On-Site / Remote"
        primary={`${presentToday}/${totalEmployees}`}
        secondary={"Employees active right now"}
        trendLabel="Attendance rate vs. yesterday"
        trendValue={`${attendanceRate.toFixed(1)}%`}
        trendPositive={attendanceRate >= 92}
      />
      <HighlightCard
        label="Payroll Readiness"
        primary={`${payrollReadyPercentage.toFixed(0)}%`}
        secondary="Employee pay packets validated"
        trendLabel="Variance vs. target (95%)"
        trendValue={`${(payrollReadyPercentage - 95).toFixed(1)}%`}
        trendPositive={payrollReadyPercentage >= 95}
      />
      <HighlightCard
        label="Agent Alerts"
        primary={`${pendingAlerts}`}
        secondary="Items require review before payroll freeze"
        trendLabel="Action priority"
        trendValue={pendingAlerts === 0 ? "All clear" : `${pendingAlerts * 15} mins`}
        trendPositive={pendingAlerts === 0}
      />
    </section>
  );
}
