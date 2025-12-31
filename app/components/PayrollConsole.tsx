"use client";

import { useMemo } from "react";
import type { Employee, PayrollRecord } from "@/lib/sampleData";

type PayrollConsoleProps = {
  employees: Employee[];
  month: string;
  records: PayrollRecord[];
  onUpdateRecord: (
    employeeId: string,
    changes: { overtimeHours?: number; deductions?: number }
  ) => void;
};

function currency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PayrollConsole({ employees, month, records, onUpdateRecord }: PayrollConsoleProps) {
  const rows = useMemo(() => {
    const map = new Map(records.filter((record) => record.month === month).map((record) => [record.employeeId, record]));
    return employees.map((employee) => ({ employee, record: map.get(employee.id) }));
  }, [employees, month, records]);

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, { record }) => {
        if (!record) return acc;
        acc.base += record.baseSalary;
        acc.overtime += record.overtimePay;
        acc.deductions += record.deductions;
        acc.net += record.netPay;
        return acc;
      },
      { base: 0, overtime: 0, deductions: 0, net: 0 }
    );
  }, [rows]);

  return (
    <section className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "18px" }}>
        <div>
          <h2 className="section-title">Payroll Console</h2>
          <p className="section-subtitle">
            Real-time preview of gross, overtime, and deductions. Adjust anomalies before exporting payroll.
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <span className="badge">Payroll Month</span>
          <div style={{ fontWeight: 700, fontSize: "22px", marginTop: "8px" }}>{month}</div>
          <div style={{ fontSize: "14px", color: "#64748b" }}>Cut-off: 5th business day</div>
        </div>
      </div>

      <div className="grid three" style={{ margin: "24px 0" }}>
        <div className="card" style={{ background: "#0f172a", color: "white" }}>
          <span style={{ fontSize: "13px", opacity: 0.7 }}>Gross payroll</span>
          <strong style={{ fontSize: "26px" }}>{currency(totals.base + totals.overtime)}</strong>
          <span style={{ fontSize: "13px", opacity: 0.7 }}>Before deductions</span>
        </div>
        <div className="card" style={{ background: "#1d4ed8", color: "white" }}>
          <span style={{ fontSize: "13px", opacity: 0.8 }}>Total deductions</span>
          <strong style={{ fontSize: "26px" }}>{currency(totals.deductions)}</strong>
          <span style={{ fontSize: "13px", opacity: 0.8 }}>Taxes, benefits, garnishments</span>
        </div>
        <div className="card" style={{ background: "#2563eb", color: "white" }}>
          <span style={{ fontSize: "13px", opacity: 0.8 }}>Projected disbursement</span>
          <strong style={{ fontSize: "26px" }}>{currency(totals.net)}</strong>
          <span style={{ fontSize: "13px", opacity: 0.8 }}>Transfers scheduled Friday 6PM UTC</span>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Gross</th>
              <th>Overtime (hrs)</th>
              <th>Deductions</th>
              <th>Net Pay</th>
              <th>Adjust</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ employee, record }) => (
              <tr key={employee.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{employee.name}</div>
                  <div style={{ fontSize: "13px", color: "#64748b" }}>{employee.department}</div>
                </td>
                <td>{record ? currency(record.baseSalary) : "-"}</td>
                <td>
                  <input
                    className="input"
                    type="number"
                    min={0}
                    step={0.5}
                    value={record ? record.overtimeHours : 0}
                    onChange={(event) =>
                      onUpdateRecord(employee.id, {
                        overtimeHours: Number(event.target.value),
                      })
                    }
                    style={{ width: "100px" }}
                  />
                </td>
                <td>
                  <input
                    className="input"
                    type="number"
                    min={0}
                    step={25}
                    value={record ? record.deductions : 0}
                    onChange={(event) =>
                      onUpdateRecord(employee.id, {
                        deductions: Number(event.target.value),
                      })
                    }
                    style={{ width: "120px" }}
                  />
                </td>
                <td>{record ? currency(record.netPay) : "-"}</td>
                <td>
                  <button
                    className="button"
                    style={{ padding: "8px 14px" }}
                    onClick={() =>
                      onUpdateRecord(employee.id, {
                        overtimeHours: 0,
                        deductions: record?.deductions ?? 0,
                      })
                    }
                  >
                    Clear OT
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
