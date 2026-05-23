import { useEffect, useMemo, useRef, useState } from "react";
import { useExpenses } from "../hooks/useExpenses";

const getTodayValue = () => new Date().toISOString().split("T")[0];

const formatDisplayDate = (value) => {
  if (!value) return "Select a date";
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString();
};

const buildMonthCells = (monthDate) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let index = 0; index < firstDayOfMonth; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(new Date(year, month, day));
  }

  return cells;
};

function CustomSelect({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div style={{ marginBottom: "20px", position: "relative" }} ref={rootRef}>
      <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>{label}</label>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        style={{
          width: "100%",
          padding: "12px 44px 12px 12px",
          border: "2px solid #3A3A3A",
          borderRadius: "8px",
          fontSize: "16px",
          fontFamily: "'Comic Neue', cursive",
          background: "#FAF8F3",
          boxSizing: "border-box",
          transition: "all 0.3s ease",
          color: "#3A3A3A",
          textAlign: "left",
          cursor: "pointer",
        }}
        onFocus={(e) => {
          e.target.style.boxShadow = "0 0 0 3px rgba(232, 114, 111, 0.3)";
          e.target.style.borderColor = "#E8726F";
        }}
        onBlur={(e) => {
          e.target.style.boxShadow = "none";
          e.target.style.borderColor = "#3A3A3A";
        }}
      >
        {value}
      </button>
      <span
        style={{
          position: "absolute",
          right: "14px",
          top: "40px",
          pointerEvents: "none",
          width: "16px",
          height: "16px",
          color: "#3A3A3A",
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={{ width: "16px", height: "16px", display: "block" }}>
          <path
            d="M7 2v2M17 2v2M4.5 8.5h15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect x="4.5" y="5.5" width="15" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </span>

      {open && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "calc(100% + 8px)",
            background: "#F5F3ED",
            border: "3px solid #3A3A3A",
            borderRadius: "12px",
            boxShadow: "6px 6px 0px rgba(0,0,0,0.12)",
            zIndex: 30,
            overflow: "hidden",
          }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "none",
                borderBottom: "1px solid rgba(58, 58, 58, 0.15)",
                background: option.value === value ? "rgba(232, 114, 111, 0.12)" : "transparent",
                color: "#3A3A3A",
                textAlign: "left",
                fontFamily: "'Comic Neue', cursive",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CustomDatePicker({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [monthDate, setMonthDate] = useState(() => {
    if (!value) return new Date();
    const [year, month] = value.split("-").map(Number);
    return new Date(year, month - 1, 1);
  });
  const rootRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (value) {
      const [year, month] = value.split("-").map(Number);
      setMonthDate(new Date(year, month - 1, 1));
    }
  }, [value]);

  const cells = buildMonthCells(monthDate);
  const monthLabel = monthDate.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <div style={{ marginBottom: "20px", position: "relative" }} ref={rootRef}>
      <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>{label}</label>
      <button
        type="button"
        onClick={() => {
          if (!open && value) {
            const [year, month] = value.split("-").map(Number);
            setMonthDate(new Date(year, month - 1, 1));
          }
          setOpen((current) => !current);
        }}
        style={{
          width: "100%",
          padding: "12px 44px 12px 12px",
          border: "2px solid #3A3A3A",
          borderRadius: "8px",
          fontSize: "16px",
          fontFamily: "'Comic Neue', cursive",
          background: "#FAF8F3",
          boxSizing: "border-box",
          transition: "all 0.3s ease",
          color: value ? "#3A3A3A" : "#8B8170",
          textAlign: "left",
          cursor: "pointer",
        }}
        onFocus={(e) => {
          e.target.style.boxShadow = "0 0 0 3px rgba(232, 114, 111, 0.3)";
          e.target.style.borderColor = "#E8726F";
        }}
        onBlur={(e) => {
          e.target.style.boxShadow = "none";
          e.target.style.borderColor = "#3A3A3A";
        }}
      >
        {formatDisplayDate(value)}
      </button>
      <span
        style={{
          position: "absolute",
          right: "14px",
          top: "39px",
          pointerEvents: "none",
          width: "16px",
          height: "16px",
          color: "#3A3A3A",
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={{ width: "16px", height: "16px", display: "block" }}>
          <path
            d="M7 2v2M17 2v2M4.5 8.5h15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect x="4.5" y="5.5" width="15" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </span>

      {open && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "calc(100% + 8px)",
            zIndex: 40,
            width: "280px",
            maxWidth: "100%",
            background: "#F5F3ED",
            border: "3px solid #3A3A3A",
            borderRadius: "14px",
            boxShadow: "6px 6px 0px rgba(0,0,0,0.12)",
            padding: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <button
              type="button"
              onClick={() => setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1))}
              style={{
                border: "2px solid #3A3A3A",
                background: "#FAF8F3",
                borderRadius: "8px",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                fontFamily: "'Comic Neue', cursive",
                fontWeight: "bold",
              }}
            >
              ‹
            </button>
            <div style={{ fontFamily: "'Bangers', cursive", fontSize: "18px", letterSpacing: "1px" }}>{monthLabel}</div>
            <button
              type="button"
              onClick={() => setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1))}
              style={{
                border: "2px solid #3A3A3A",
                background: "#FAF8F3",
                borderRadius: "8px",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                fontFamily: "'Comic Neue', cursive",
                fontWeight: "bold",
              }}
            >
              ›
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "6px" }}>
            {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
              <div key={day} style={{ textAlign: "center", fontSize: "11px", fontWeight: "bold", color: "#6B6354" }}>
                {day}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
            {cells.map((cell, index) => {
              if (!cell) {
                return <div key={`empty-${index}`} style={{ height: "32px" }} />;
              }

              const dayValue = cell.toISOString().split("T")[0];
              const isSelected = value === dayValue;

              return (
                <button
                  key={dayValue}
                  type="button"
                  onClick={() => {
                    onChange(dayValue);
                    setOpen(false);
                  }}
                  style={{
                    height: "32px",
                    borderRadius: "8px",
                    border: `2px solid ${isSelected ? "#E8726F" : "#3A3A3A"}`,
                    background: isSelected ? "#E8726F" : "#FAF8F3",
                    color: isSelected ? "#FAF8F3" : "#3A3A3A",
                    cursor: "pointer",
                    fontFamily: "'Comic Neue', cursive",
                    fontWeight: "bold",
                  }}
                >
                  {cell.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExpensesPage() {
  const { expenses, addExpense, deleteExpense, loading, error } = useExpenses();
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("debit");
  const [date, setDate] = useState(getTodayValue());
  const [formError, setFormError] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const summary = useMemo(() => {
    const totals = expenses.reduce(
      (accumulator, expense) => {
        const amountValue = Number(expense.amount) || 0;
        accumulator.count += 1;
        if (expense.type === "debit") {
          accumulator.debitTotal += amountValue;
          accumulator.debitCount += 1;
        } else {
          accumulator.creditTotal += amountValue;
          accumulator.creditCount += 1;
        }
        return accumulator;
      },
      {
        count: 0,
        debitTotal: 0,
        creditTotal: 0,
        debitCount: 0,
        creditCount: 0,
      }
    );

    return {
      ...totals,
      netImpact: totals.creditTotal - totals.debitTotal,
    };
  }, [expenses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const numericAmount = parseFloat(amount);
    if (!label.trim()) {
      setFormError("Please enter an expense label.");
      return;
    }
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      setFormError("Please enter a valid amount.");
      return;
    }

    try {
      await addExpense(label.trim(), numericAmount, type, date);
      e.target.reset();
      setLabel("");
      setAmount("");
      setType("debit");
      setDate(getTodayValue());
    } catch (err) {
      setFormError(err.message);
    }
  };

  const openDeleteDialog = (expense) => {
    setExpenseToDelete(expense);
  };

  const closeDeleteDialog = () => {
    setExpenseToDelete(null);
  };

  const confirmDelete = async () => {
    if (!expenseToDelete) return;

    try {
      await deleteExpense(expenseToDelete.id);
      setSelectedExpense(null);
      setExpenseToDelete(null);
    } catch (err) {
      setFormError(err.message);
    }
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeDeleteDialog();
      }
    };

    if (expenseToDelete) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => document.removeEventListener("keydown", handleEscape);
  }, [expenseToDelete]);

  return (
    <div style={{ padding: "40px", background: "#FAF8F3", minHeight: "100vh" }}>
      <style>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>

      <h1 style={{ fontSize: "48px", marginBottom: "18px" }}>💸 Expenses</h1>
      <p style={{ color: "#6B6354", marginBottom: "30px", fontSize: "16px" }}>
        Keep spending and refunds in the same visual rhythm as your trades dashboard.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "16px", marginBottom: "30px" }}>
        <div style={{ background: "#F5F3ED", border: "3px solid #3A3A3A", borderRadius: "14px", padding: "18px", boxShadow: "4px 4px 0px rgba(0,0,0,0.12)" }}>
          <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px", fontWeight: "bold" }}>TOTAL EXPENSES</p>
          <p style={{ fontSize: "28px", fontWeight: "bold", color: "#D97560" }}>₹{summary.debitTotal.toFixed(2)}</p>
        </div>
        <div style={{ background: "#F5F3ED", border: "3px solid #3A3A3A", borderRadius: "14px", padding: "18px", boxShadow: "4px 4px 0px rgba(0,0,0,0.12)" }}>
          <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px", fontWeight: "bold" }}>TOTAL REFUNDS</p>
          <p style={{ fontSize: "28px", fontWeight: "bold", color: "#6BA583" }}>₹{summary.creditTotal.toFixed(2)}</p>
        </div>
        <div style={{ background: "#F5F3ED", border: "3px solid #3A3A3A", borderRadius: "14px", padding: "18px", boxShadow: "4px 4px 0px rgba(0,0,0,0.12)" }}>
          <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px", fontWeight: "bold" }}>NET IMPACT</p>
          <p style={{ fontSize: "28px", fontWeight: "bold", color: summary.netImpact >= 0 ? "#6BA583" : "#D97560" }}>
            ₹{Math.abs(summary.netImpact).toFixed(2)}
          </p>
        </div>
        <div style={{ background: "#F5F3ED", border: "3px solid #3A3A3A", borderRadius: "14px", padding: "18px", boxShadow: "4px 4px 0px rgba(0,0,0,0.12)" }}>
          <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px", fontWeight: "bold" }}>ENTRIES</p>
          <p style={{ fontSize: "28px", fontWeight: "bold", color: "#3A3A3A" }}>{summary.count}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "40px" }}>
        <div style={{ flex: 1, order: 1 }}>
          <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>📋 Expense History</h2>
          {error && <p style={{ color: "#D97560", marginBottom: "15px", fontWeight: "bold" }}>❌ {error}</p>}

          {loading && expenses.length === 0 ? (
            <div style={{ background: "#F5F3ED", border: "3px dashed #3A3A3A", padding: "50px", textAlign: "center", borderRadius: "12px", color: "#666" }}>
              <p style={{ fontSize: "18px" }}>Loading expenses...</p>
            </div>
          ) : expenses.length === 0 ? (
            <div style={{ background: "#F5F3ED", border: "3px dashed #3A3A3A", padding: "50px", textAlign: "center", borderRadius: "12px", color: "#666", animation: "slideIn 0.6s ease-out" }}>
              <p style={{ fontSize: "18px" }}>No expenses yet. Add your first entry! 💸</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {expenses.map((expense, idx) => {
                const isExpense = expense.type === "debit";
                const amountColor = isExpense ? "#D97560" : "#6BA583";
                const chipBackground = isExpense ? "rgba(217, 117, 96, 0.12)" : "rgba(107, 165, 131, 0.12)";
                const chipBorder = isExpense ? "#D97560" : "#6BA583";

                return (
                  <div
                    key={expense.id}
                    onClick={() => setSelectedExpense(selectedExpense === expense.id ? null : expense.id)}
                    style={{
                      background: "#F5F3ED",
                      border: "3px solid #3A3A3A",
                      borderRadius: "12px 10px 14px 16px",
                      padding: "20px",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      boxShadow: selectedExpense === expense.id ? "8px 8px 0px rgba(0,0,0,0.2)" : "3px 3px 0px rgba(0,0,0,0.1)",
                      transform: selectedExpense === expense.id ? "translateY(-8px) rotate(1deg)" : "translateY(0) rotate(0deg)",
                      animation: `slideIn ${0.3 + idx * 0.1}s ease-out`,
                    }}
                    onMouseOver={(e) => {
                      if (selectedExpense !== expense.id) {
                        e.currentTarget.style.transform = "translateY(-4px) rotate(-0.5deg)";
                        e.currentTarget.style.boxShadow = "5px 5px 0px rgba(0,0,0,0.15)";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedExpense !== expense.id) {
                        e.currentTarget.style.transform = "translateY(0) rotate(0deg)";
                        e.currentTarget.style.boxShadow = "3px 3px 0px rgba(0,0,0,0.1)";
                      }
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "18px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                          <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>{expense.label}</h3>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: "bold",
                              padding: "5px 10px",
                              borderRadius: "999px",
                              border: `2px solid ${chipBorder}`,
                              background: chipBackground,
                              color: chipBorder,
                            }}
                          >
                            {isExpense ? "Expense" : "Refund"}
                          </span>
                        </div>
                        <p style={{ fontSize: "14px", color: "#666" }}>
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "24px", fontWeight: "bold", color: amountColor, marginBottom: "5px" }}>
                          ₹{expense.amount.toFixed(2)}
                        </p>
                        <p style={{ fontSize: "12px", color: "#666" }}>
                          {selectedExpense === expense.id ? "▼ Click to collapse" : "▶ Click to expand"}
                        </p>
                      </div>
                    </div>

                    {selectedExpense === expense.id && (
                      <div
                        style={{
                          marginTop: "20px",
                          paddingTop: "20px",
                          borderTop: "2px dashed #3A3A3A",
                          animation: "slideIn 0.3s ease-out",
                        }}
                      >
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
                          <div style={{ background: "#FAF8F3", padding: "15px", borderRadius: "8px", border: "2px solid #3A3A3A" }}>
                            <p style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>LABEL</p>
                            <p style={{ fontSize: "18px", fontWeight: "bold" }}>{expense.label}</p>
                          </div>
                          <div style={{ background: "#FAF8F3", padding: "15px", borderRadius: "8px", border: "2px solid #3A3A3A" }}>
                            <p style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>AMOUNT</p>
                            <p style={{ fontSize: "18px", fontWeight: "bold", color: amountColor }}>₹{expense.amount.toFixed(2)}</p>
                          </div>
                          <div style={{ background: "#FAF8F3", padding: "15px", borderRadius: "8px", border: "2px solid #3A3A3A" }}>
                            <p style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>TYPE</p>
                            <p style={{ fontSize: "18px", fontWeight: "bold" }}>{isExpense ? "Expense (Debit)" : "Refund (Credit)"}</p>
                          </div>
                          <div style={{ background: "#FAF8F3", padding: "15px", borderRadius: "8px", border: "2px solid #3A3A3A" }}>
                            <p style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>DATE</p>
                            <p style={{ fontSize: "18px", fontWeight: "bold" }}>{new Date(expense.date).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteDialog(expense);
                          }}
                          style={{
                            width: "100%",
                            background: "#D97560",
                            color: "#FAF8F3",
                            border: "2px solid #3A3A3A",
                            padding: "12px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontFamily: "'Comic Neue', cursive",
                            fontWeight: "bold",
                            transition: "all 0.3s ease",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = "scale(1.05)";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = "scale(1)";
                          }}
                        >
                          🗑️ Delete Expense
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ width: "400px", position: "sticky", top: "20px", height: "fit-content", order: 2 }}>
          <div
            className="card"
            style={{
              background: "#F5F3ED",
              border: "3px solid #3A3A3A",
              padding: "30px",
              borderRadius: "12px 16px 10px 14px",
              boxShadow: "4px 4px 0px rgba(0,0,0,0.12)",
            }}
          >
            <h2 style={{ fontSize: "28px", marginBottom: "25px" }}>➕ Add New Expense</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>Label</label>
                <input
                  autoComplete="off"
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g., Brokerage, Internet, Equipment"
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #3A3A3A",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontFamily: "'Comic Neue', cursive",
                    background: "#FAF8F3",
                    boxSizing: "border-box",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = "0 0 0 3px rgba(232, 114, 111, 0.3)";
                    e.target.style.borderColor = "#E8726F";
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = "none";
                    e.target.style.borderColor = "#3A3A3A";
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>Amount (₹)</label>
                <input
                  autoComplete="off"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #3A3A3A",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontFamily: "'Comic Neue', cursive",
                    background: "#FAF8F3",
                    boxSizing: "border-box",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = "0 0 0 3px rgba(232, 114, 111, 0.3)";
                    e.target.style.borderColor = "#E8726F";
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = "none";
                    e.target.style.borderColor = "#3A3A3A";
                  }}
                />
              </div>

              <CustomSelect
                label="Type"
                value={type}
                onChange={setType}
                options={[
                  { value: "debit", label: "Expense (Debit)" },
                  { value: "credit", label: "Refund (Credit)" },
                ]}
              />

              <CustomDatePicker label="Date" value={date} onChange={setDate} />

              {formError && <p style={{ color: "#D97560", marginBottom: "15px", fontWeight: "bold" }}>❌ {formError}</p>}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "15px",
                  background: "#E8726F",
                  border: "3px solid #3A3A3A",
                  color: "#FAF8F3",
                  fontSize: "16px",
                  fontFamily: "'Comic Neue', cursive",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  opacity: loading ? 0.6 : 1,
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.transform = "translateY(-3px)";
                    e.target.style.boxShadow = "5px 5px 0px rgba(0,0,0,0.18)";
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                {loading ? "Adding..." : "💾 Save Expense"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {expenseToDelete && (
        <div
          onClick={closeDeleteDialog}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(58, 58, 58, 0.55)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 100,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#F5F3ED",
              border: "3px solid #3A3A3A",
              borderRadius: "18px",
              boxShadow: "10px 10px 0px rgba(0,0,0,0.18)",
              padding: "24px",
              animation: "slideIn 0.2s ease-out",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "rgba(217, 117, 96, 0.14)",
                  border: "2px solid #D97560",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#D97560",
                  fontWeight: "bold",
                  fontSize: "20px",
                  flexShrink: 0,
                }}
              >
                !
              </div>
              <div>
                <h3 style={{ fontSize: "26px", marginBottom: "4px" }}>Delete Expense?</h3>
                <p style={{ color: "#666", fontSize: "14px" }}>
                  This will remove {expenseToDelete.label} from your expense history.
                </p>
              </div>
            </div>

            <div
              style={{
                background: "#FAF8F3",
                border: "2px solid #3A3A3A",
                borderRadius: "12px",
                padding: "14px",
                marginBottom: "18px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "8px" }}>
                <span style={{ color: "#666", fontSize: "13px" }}>Label</span>
                <span style={{ fontWeight: "bold" }}>{expenseToDelete.label}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "8px" }}>
                <span style={{ color: "#666", fontSize: "13px" }}>Type</span>
                <span style={{ fontWeight: "bold" }}>
                  {expenseToDelete.type === "debit" ? "Expense" : "Refund"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                <span style={{ color: "#666", fontSize: "13px" }}>Amount</span>
                <span style={{ fontWeight: "bold", color: expenseToDelete.type === "debit" ? "#D97560" : "#6BA583" }}>
                  ₹{expenseToDelete.amount.toFixed(2)}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                onClick={closeDeleteDialog}
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "2px solid #3A3A3A",
                  background: "#FAF8F3",
                  color: "#3A3A3A",
                  fontFamily: "'Comic Neue', cursive",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                No, keep it
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "2px solid #3A3A3A",
                  background: "#D97560",
                  color: "#FAF8F3",
                  fontFamily: "'Comic Neue', cursive",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}