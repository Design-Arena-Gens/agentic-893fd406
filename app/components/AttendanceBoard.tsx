"use client";

import { useMemo } from "react";
import type { AttendanceRecord, AttendanceStatus, Employee } from "@/lib/sampleData";

type AttendanceBoardProps = {
  employees: Employee[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  records: AttendanceRecord[];
  onUpdateRecord: (
    employeeId: string,
    changes: { status?: AttendanceStatus; notes?: string }
  ) => void;
  onBulkUpdate: (status: AttendanceStatus) => void;
};

const statusPalette: Record<AttendanceStatus, { bg: string; text: string }> = {
  Present: { bg: "rgba(16, 185, 129, 0.12)", text: "#047857" },
  Remote: { bg: "rgba(14, 165, 233, 0.12)", text: "#0369a1" },
  Leave: { bg: "rgba(250, 204, 21, 0.16)", text: "#b45309" },
  Absent: { bg: "rgba(248, 113, 113, 0.16)", text: "#b91c1c" },
};

export function AttendanceBoard({
  employees,
  selectedDate,
  onDateChange,
  records,
  onUpdateRecord,
  onBulkUpdate,
}: AttendanceBoardProps) {
  const rows = useMemo(() => {
    const targetRecords = records.filter((record) => record.date === selectedDate);
    const map = new Map(targetRecords.map((record) => [record.employeeId, record]));

    return employees.map((employee) => {
      const record = map.get(employee.id);
      return {
        employee,
        record,
      };
    });
  }, [employees, records, selectedDate]);

  const summary = useMemo(() => {
    const counts = { Present: 0, Remote: 0, Leave: 0, Absent: 0 } as Record<AttendanceStatus, number>;
    rows.forEach(({ record }) => {
      if (record) counts[record.status] += 1;
    });
    const total = rows.length || 1;
    const productivityScore = ((counts.Present + counts.Remote * 0.9) / total) * 100;
    return { counts, productivityScore };
  }, [rows]);

  return (
    <section className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
        <div>
          <h2 className="section-title">Attendance Control</h2>
          <p className="section-subtitle">Capture on-site, remote, and leave plans. Agent auto-logs changes for payroll.</p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <label style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>
            Tracking date
            <input
              className="input"
              type="date"
              value={selectedDate}
              onChange={(event) => onDateChange(event.target.value)}
              style={{ marginTop: "6px", width: "180px" }}
            />
          </label>
          <button className="button secondary" onClick={() => onBulkUpdate("Present")}>
            Mark All Present
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "18px", flexWrap: "wrap", margin: "18px 0 12px" }}>
        {(Object.keys(statusPalette) as AttendanceStatus[]).map((status) => {
          const count = summary.counts[status];
          return (
            <span
              key={status}
              className="tag"
              style={{
                background: statusPalette[status].bg,
                color: statusPalette[status].text,
                minWidth: "120px",
                justifyContent: "space-between",
              }}
            >
              <span>{status}</span>
              <strong style={{ fontWeight: 700 }}>{count}</strong>
            </span>
          );
        })}
        <span className="tag success" style={{ marginLeft: "auto" }}>
          Productivity index {summary.productivityScore.toFixed(0)}%
        </span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ employee, record }) => {
              const status = record?.status ?? "Absent";
              const palette = statusPalette[status];
              return (
                <tr key={employee.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: "#0f172a" }}>{employee.name}</div>
                    <div style={{ color: "#64748b", fontSize: "13px" }}>{employee.role}</div>
                  </td>
                  <td style={{ color: "#475569", fontSize: "14px" }}>{employee.department}</td>
                  <td>
                    <select
                      className="select"
                      value={status}
                      onChange={(event) => onUpdateRecord(employee.id, { status: event.target.value as AttendanceStatus })}
                      style={{
                        borderColor: palette.text,
                        background: palette.bg,
                        color: palette.text,
                        fontWeight: 600,
                      }}
                    >
                      <option value="Present">Present</option>
                      <option value="Remote">Remote</option>
                      <option value="Leave">Leave</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </td>
                  <td>
                    <textarea
                      className="input"
                      placeholder="Optional notes"
                      value={record?.notes ?? ""}
                      onChange={(event) => onUpdateRecord(employee.id, { notes: event.target.value })}
                      style={{ minWidth: "220px", minHeight: "38px" }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
