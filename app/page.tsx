"use client";

import { useMemo, useState } from "react";
import { Header } from "./components/Header";
import { DashboardHighlights } from "./components/DashboardHighlights";
import { AttendanceBoard } from "./components/AttendanceBoard";
import { PayrollConsole } from "./components/PayrollConsole";
import { InsightsPanel } from "./components/InsightsPanel";
import { OperationsTimeline } from "./components/OperationsTimeline";
import { ActionComposer } from "./components/ActionComposer";
import type { AttendanceRecord, AttendanceStatus, PayrollRecord } from "../lib/sampleData";
import { sampleAttendance, sampleEmployees, samplePayroll } from "../lib/sampleData";

const defaultAttendanceDate = sampleAttendance[sampleAttendance.length - 1]?.date ?? new Date().toISOString().slice(0, 10);
const payrollMonth = "2024-05";

export default function Page() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(sampleAttendance);
  const [selectedDate, setSelectedDate] = useState(defaultAttendanceDate);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(samplePayroll);

  const todaysMetrics = useMemo(() => {
    const recordsForDate = attendanceRecords.filter((record) => record.date === selectedDate);
    const recordMap = new Map(recordsForDate.map((record) => [record.employeeId, record]));

    let present = 0;
    let remote = 0;
    let leave = 0;
    let absent = 0;

    sampleEmployees.forEach((employee) => {
      const record = recordMap.get(employee.id);
      switch (record?.status) {
        case "Present":
          present += 1;
          break;
        case "Remote":
          remote += 1;
          break;
        case "Leave":
          leave += 1;
          break;
        case "Absent":
          absent += 1;
          break;
        default:
          absent += 1;
      }
    });

    const attendanceRate = ((present + remote * 0.85) / sampleEmployees.length) * 100;
    const productivity = ((present + remote * 0.9) / sampleEmployees.length) * 100;
    const alerts = Math.max(0, leave + absent - 1);

    return {
      presentToday: present + remote,
      presentCount: present,
      remoteCount: remote,
      leaveCount: leave,
      attendanceRate,
      productivity,
      alerts,
    };
  }, [attendanceRecords, selectedDate]);

  const payrollReadiness = useMemo(() => {
    const recordsForMonth = payrollRecords.filter((record) => record.month === payrollMonth);
    const ready = recordsForMonth.filter((record) => record.netPay > 0).length;
    const overtimeVariance = recordsForMonth.reduce((acc, record) => acc + record.overtimeHours, 0) / (recordsForMonth.length || 1);
    const netPayroll = recordsForMonth.reduce((acc, record) => acc + record.netPay, 0);
    return {
      readiness: (ready / sampleEmployees.length) * 100,
      overtimeVariance,
      netPayroll,
    };
  }, [payrollRecords]);

  const insights = useMemo(() => {
    const results = [] as { title: string; description: string; severity: "low" | "medium" | "high" }[];

    if (todaysMetrics.attendanceRate < 94) {
      results.push({
        title: "Attendance dip vs. target",
        description: `Attendance efficiency tracking at ${todaysMetrics.attendanceRate.toFixed(1)}%. Investigate remote compliance and PTO overlaps in Customer Success team.`,
        severity: "medium",
      });
    } else {
      results.push({
        title: "Attendance stable",
        description: `Team operating at ${todaysMetrics.attendanceRate.toFixed(1)}% attendance coverage. Auto-escalations remain off.`,
        severity: "low",
      });
    }

    if (payrollReadiness.readiness < 95) {
      results.push({
        title: "Payroll readiness below threshold",
        description: `${(100 - payrollReadiness.readiness).toFixed(1)}% of employees still pending approvals. Target follow-ups with managers today to avoid Friday overtime.`,
        severity: "high",
      });
    } else {
      results.push({
        title: "Payroll packets validated",
        description: `Projected disbursement ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(payrollReadiness.netPayroll)} is ready for treasury handoff.`,
        severity: "low",
      });
    }

    if (payrollReadiness.overtimeVariance > 6) {
      results.push({
        title: "Spike in overtime",
        description: `Average overtime hours at ${payrollReadiness.overtimeVariance.toFixed(1)}h. Agent recommends QA on approvals in Engineering and Finance squads.`,
        severity: "medium",
      });
    }

    if (todaysMetrics.alerts > 0) {
      results.push({
        title: "Action needed: coverage gaps",
        description: `There are ${todaysMetrics.alerts} prioritized absences/leave requiring backfill planning.`,
        severity: "medium",
      });
    }

    return results;
  }, [todaysMetrics, payrollReadiness]);

  const recommendations = useMemo(() => {
    const list = [
      "Run 2PM check-in with Customer Success leads to confirm remote adherence.",
      "Share payroll readiness report with Finance before 4PM for approvals.",
      "Trigger compliance export after verifying contractor timesheets.",
    ];

    if (payrollReadiness.readiness < 95) {
      list.unshift("Escalate pending payroll approvals to department heads with auto-reminders.");
    }

    if (todaysMetrics.productivity < 90) {
      list.push("Enable meeting-free focus block for Engineering to stabilize productivity.");
    }

    return list;
  }, [payrollReadiness.readiness, todaysMetrics.productivity]);

  const timelineItems = useMemo(
    () => [
      {
        time: "09:30",
        title: "Attendance reconciliation",
        description: "Agent posted updates to HRIS and synced remote statuses to Slack channel #ops-attendance.",
        owner: "Agent Sasha",
        status: "done" as const,
      },
      {
        time: "12:00",
        title: "Manager nudges",
        description: "Pending payroll approvals for Customer Success & Finance queued for manager review.",
        owner: "Agent Miguel",
        status: "in-progress" as const,
      },
      {
        time: "15:30",
        title: "Overtime validation",
        description: "Cross-check overtime claims with Jira logged hours; auto-flag anomalies > 4h.",
        owner: "Agent Noor",
        status: "pending" as const,
      },
      {
        time: "17:45",
        title: "Payroll export",
        description: "Generate ACH file & funding memo draft for treasury handoff.",
        owner: "Agent Derek",
        status: "pending" as const,
      },
    ],
    []
  );

  const handleAttendanceUpdate = (
    employeeId: string,
    changes: { status?: AttendanceStatus; notes?: string }
  ) => {
    setAttendanceRecords((prev) => {
      const index = prev.findIndex((record) => record.employeeId === employeeId && record.date === selectedDate);
      if (index === -1) {
        const newRecord: AttendanceRecord = {
          employeeId,
          date: selectedDate,
          status: changes.status ?? "Present",
          notes: changes.notes,
        };
        return [...prev, newRecord];
      }

      const nextRecord = { ...prev[index], ...changes } as AttendanceRecord;
      const next = [...prev];
      next[index] = nextRecord;
      return next;
    });
  };

  const handleAttendanceBulk = (status: AttendanceStatus) => {
    setAttendanceRecords((prev) => {
      const existing = prev.filter((record) => record.date !== selectedDate);
      const updated = sampleEmployees.map<AttendanceRecord>((employee) => {
        const existingRecord = prev.find((record) => record.employeeId === employee.id && record.date === selectedDate);
        return {
          employeeId: employee.id,
          date: selectedDate,
          status: existingRecord?.status ?? status,
          notes: existingRecord?.notes,
        };
      });
      return [...existing, ...updated.map((record) => ({ ...record, status }))];
    });
  };

  const handlePayrollUpdate = (
    employeeId: string,
    changes: { overtimeHours?: number; deductions?: number }
  ) => {
    setPayrollRecords((prev) => {
      const index = prev.findIndex((record) => record.employeeId === employeeId && record.month === payrollMonth);
      if (index === -1) return prev;

      const current = prev[index];
      const overtimeHours = changes.overtimeHours ?? current.overtimeHours;
      const deductions = changes.deductions ?? current.deductions;
      const hourlyRate = current.baseSalary / 160;
      const overtimePay = Math.round(overtimeHours * hourlyRate * 100) / 100;
      const netPay = Math.round((current.baseSalary + overtimePay - deductions) * 100) / 100;

      const nextRecord: PayrollRecord = {
        ...current,
        overtimeHours,
        overtimePay,
        deductions,
        netPay,
      };

      const next = [...prev];
      next[index] = nextRecord;
      return next;
    });
  };

  const defaultMessage = useMemo(() => {
    const recordsForMonth = payrollRecords.filter((record) => record.month === payrollMonth).length;
    const pending = Math.max(0, Math.round(sampleEmployees.length * 0.95 - recordsForMonth));
    const readiness = payrollReadiness.readiness.toFixed(1);
    return `Hi Finance Team,\n\nAttendance coverage sits at ${todaysMetrics.attendanceRate.toFixed(1)}% with remote utilization of ${todaysMetrics.remoteCount} team members. Payroll readiness for ${payrollMonth} is currently at ${readiness}% and ${payrollReadiness.overtimeVariance.toFixed(1)}h average overtime.\n\nKey follow-ups:\n• Resolve ${todaysMetrics.alerts} open attendance gaps before 3PM.\n• Close remaining payroll approvals (est. ${pending}) to stay on track for Friday funding.\n• Review overtime detail for Engineering & Finance squads.\n\nLet me know if you need deeper dives.\n\nThanks,\nHR Automation Agent`;
  }, [payrollReadiness, payrollRecords, todaysMetrics]);

  return (
    <main>
      <div className="container">
        <Header />
        <DashboardHighlights
          totalEmployees={sampleEmployees.length}
          presentToday={todaysMetrics.presentToday}
          attendanceRate={todaysMetrics.attendanceRate}
          payrollReadyPercentage={payrollReadiness.readiness}
          pendingAlerts={todaysMetrics.alerts}
        />
        <div className="grid two">
          <AttendanceBoard
            employees={sampleEmployees}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            records={attendanceRecords}
            onUpdateRecord={handleAttendanceUpdate}
            onBulkUpdate={handleAttendanceBulk}
          />
          <InsightsPanel insights={insights} recommendations={recommendations} />
        </div>
        <div className="grid two" style={{ marginTop: "24px" }}>
          <PayrollConsole
            employees={sampleEmployees}
            month={payrollMonth}
            records={payrollRecords}
            onUpdateRecord={handlePayrollUpdate}
          />
          <div className="grid" style={{ gap: "24px" }}>
            <OperationsTimeline items={timelineItems} />
            <ActionComposer
              defaultSubject={`Attendance & Payroll Status — ${payrollMonth}`}
              defaultBody={defaultMessage}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
