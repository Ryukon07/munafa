import { useEffect, useMemo, useRef, useState } from "react";
import { useExpenses } from "../hooks/useExpenses";

const getTodayValue = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

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
    <div className="custom-date-picker-root" style={{ marginBottom: "20px", position: "relative" }} ref={rootRef}>
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
          <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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
          className="custom-date-picker-popup"
          style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 210,
            width: "min(360px, calc(100vw - 32px))",
            maxWidth: "calc(100vw - 32px)",
            maxHeight: "min(80vh, 540px)",
            overflow: "auto",
            background: "#F5F3ED",
            border: "3px solid #3A3A3A",
            borderRadius: "14px",
            boxShadow: "6px 6px 0px rgba(0,0,0,0.12)",
            padding: "12px",
          }}
        >
          <div className="custom-date-picker-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
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

          <div className="custom-date-picker-weekdays" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "6px" }}>
            {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
              <div key={day} style={{ textAlign: "center", fontSize: "11px", fontWeight: "bold", color: "#6B6354" }}>
                {day}
              </div>
            ))}
          </div>

          <div className="custom-date-picker-grid" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
            {cells.map((cell, index) => {
              if (!cell) {
                return <div key={`empty-${index}`} style={{ height: "32px" }} />;
              }

              const dayValue = `${cell.getFullYear()}-${String(cell.getMonth() + 1).padStart(2, "0")}-${String(cell.getDate()).padStart(2, "0")}`;
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

  const expenseRate = summary.count ? Math.round((summary.debitCount / summary.count) * 100) : 0;
  const summaryCards = [
    {
      label: "Total Expenses",
      value: `₹${summary.debitTotal.toFixed(2)}`,
      tone: "negative",
      note: `${summary.debitCount} debit entries`,
    },
    {
      label: "Total Refunds",
      value: `₹${summary.creditTotal.toFixed(2)}`,
      tone: "positive",
      note: `${summary.creditCount} credits`,
    },
    {
      label: "Net Impact",
      value: `₹${Math.abs(summary.netImpact).toFixed(2)}`,
      tone: summary.netImpact >= 0 ? "positive" : "negative",
      note: summary.netImpact >= 0 ? "Refunds are ahead" : "Spending is ahead",
    },
    {
      label: "Expense Rate",
      value: `${expenseRate}%`,
      tone: "neutral",
      note: `${summary.count} total entries`,
    },
  ];

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
    <div className="expenses-page" style={{ padding: "40px", background: "#FAF8F3", minHeight: "100vh" }}>
      <style>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }

        @keyframes floatSoft {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(0.6deg); }
        }

        @keyframes shimmerSweep {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }

        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>

      <div className="expenses-hero" style={{ marginBottom: "28px", position: "relative" }}>
        <div
          aria-hidden="true"
          className="expenses-orb expenses-orb-a"
          style={{
            position: "absolute",
            top: "-34px",
            right: "-18px",
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,114,111,0.2), rgba(232,114,111,0))",
            filter: "blur(2px)",
            pointerEvents: "none",
            animation: "floatSoft 5s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden="true"
          className="expenses-orb expenses-orb-b"
          style={{
            position: "absolute",
            bottom: "-40px",
            left: "12px",
            width: "140px",
            height: "140px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(107,165,131,0.18), rgba(107,165,131,0))",
            filter: "blur(2px)",
            pointerEvents: "none",
            animation: "floatSoft 6s ease-in-out infinite",
          }}
        />
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 14px",
            border: "1px solid color-mix(in srgb, var(--border) 82%, transparent)",
            borderRadius: "999px",
            background: "color-mix(in srgb, var(--surface) 88%, transparent)",
            boxShadow: "0 10px 18px var(--shadow)",
            marginBottom: "14px",
            position: "relative",
            zIndex: 1,
            color: "var(--text)",
          }}
        >
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--accent)", animation: "pulseDot 1.6s ease-in-out infinite" }} />
          Expense log
        </div>
        <h1 style={{ fontSize: "48px", marginBottom: "10px", position: "relative", zIndex: 1, color: "var(--text)" }}>Expenses</h1>
        <p style={{ color: "var(--muted)", fontSize: "16px", position: "relative", zIndex: 1, maxWidth: "58ch" }}>
          Keep spending and refunds in the same visual rhythm as your trades dashboard.
        </p>
      </div>

      <div className="expenses-summary-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "16px", marginBottom: "30px" }}>
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className={`expenses-summary-card expenses-summary-${card.tone}`}
            style={{
              background: "#F5F3ED",
              border: "3px solid #3A3A3A",
              borderRadius: "14px",
              padding: "18px",
              boxShadow: "4px 4px 0px rgba(0,0,0,0.12)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.36) 50%, transparent 100%)",
                transform: "translateX(-120%)",
                animation: "shimmerSweep 6s ease-in-out infinite",
              }}
            />
            <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px", fontWeight: "bold", position: "relative", zIndex: 1 }}>{card.label}</p>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: card.tone === "positive" ? "#6BA583" : card.tone === "negative" ? "#D97560" : "#3A3A3A", position: "relative", zIndex: 1 }}>
              {card.value}
            </p>
            <p style={{ fontSize: "12px", color: "#666", marginTop: "6px", position: "relative", zIndex: 1 }}>{card.note}</p>
          </div>
        ))}
      </div>

      <div className="expenses-layout" style={{ display: "flex", gap: "40px" }}>
        <div className="expenses-history-panel" style={{ flex: 1, order: 1 }}>
          <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>Expense History</h2>
          {error && <p style={{ color: "#D97560", marginBottom: "15px", fontWeight: "bold" }}>{error}</p>}

          {loading && expenses.length === 0 ? (
            <div style={{ background: "#F5F3ED", border: "3px dashed #3A3A3A", padding: "50px", textAlign: "center", borderRadius: "12px", color: "#666" }}>
              <p style={{ fontSize: "18px" }}>Loading expenses...</p>
            </div>
          ) : expenses.length === 0 ? (
            <div style={{ background: "#F5F3ED", border: "3px dashed #3A3A3A", padding: "50px", textAlign: "center", borderRadius: "12px", color: "#666", animation: "slideIn 0.6s ease-out" }}>
              <p style={{ fontSize: "18px" }}>No expenses yet. Add your first entry.</p>
            </div>
          ) : (
            <div className="expenses-history-list" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {expenses.map((expense, idx) => {
                const isExpense = expense.type === "debit";
                const amountColor = isExpense ? "#D97560" : "#6BA583";
                const chipBackground = isExpense ? "rgba(217, 117, 96, 0.12)" : "rgba(107, 165, 131, 0.12)";
                const chipBorder = isExpense ? "#D97560" : "#6BA583";

                return (
                  <div
                    key={expense.id}
                    onClick={() => setSelectedExpense(selectedExpense === expense.id ? null : expense.id)}
                    className={`expense-card ${selectedExpense === expense.id ? "is-open" : ""}`}
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
                      position: "relative",
                      overflow: "hidden",
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
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: "10px",
                        background: isExpense ? "linear-gradient(180deg, #D97560, #E7A089)" : "linear-gradient(180deg, #6BA583, #92C2A5)",
                      }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "18px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                          <h3 style={{ fontSize: "20px", fontWeight: "bold" }} className="expense-card-title">{expense.label}</h3>
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
                      <div style={{ textAlign: "right" }} className="expense-card-value">
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
                        className="expense-card-details"
                        style={{
                          marginTop: "20px",
                          paddingTop: "20px",
                          borderTop: "2px dashed #3A3A3A",
                          animation: "slideIn 0.3s ease-out",
                        }}
                      >
                        <div className="expense-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
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
                          Delete Expense
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="expenses-form-panel" style={{ width: "400px", position: "sticky", top: "20px", height: "fit-content", order: 2, alignSelf: "flex-start" }}>
          <div
            className="card expenses-form-card"
            style={{
              background: "#F5F3ED",
              border: "3px solid #3A3A3A",
              padding: "30px",
              borderRadius: "12px 16px 10px 14px",
              boxShadow: "4px 4px 0px rgba(0,0,0,0.12)",
              position: "relative",
              overflow: "visible",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle at top right, rgba(232,114,111,0.14), transparent 28%), radial-gradient(circle at bottom left, rgba(107,165,131,0.12), transparent 26%)",
                pointerEvents: "none",
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                border: "3px solid rgba(58,58,58,0.12)",
                background: "rgba(250,248,243,0.6)",
                pointerEvents: "none",
                animation: "floatSoft 5s ease-in-out infinite",
              }}
            />
            <h2 style={{ fontSize: "28px", marginBottom: "25px" }}>Add New Expense</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px", position: "relative", zIndex: 1 }}>
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
                    border: "1px solid color-mix(in srgb, var(--border) 82%, transparent)",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontFamily: "'Comic Neue', cursive",
                    background: "var(--panel)",
                    boxSizing: "border-box",
                    transition: "all 0.3s ease",
                    color: "var(--text)",
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = "0 0 0 3px var(--focus)";
                    e.target.style.borderColor = "var(--accent)";
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = "none";
                    e.target.style.borderColor = "color-mix(in srgb, var(--border) 82%, transparent)";
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px", position: "relative", zIndex: 1 }}>
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
                    border: "1px solid color-mix(in srgb, var(--border) 82%, transparent)",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontFamily: "'Comic Neue', cursive",
                    background: "var(--panel)",
                    boxSizing: "border-box",
                    transition: "all 0.3s ease",
                    color: "var(--text)",
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = "0 0 0 3px var(--focus)";
                    e.target.style.borderColor = "var(--accent)";
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = "none";
                    e.target.style.borderColor = "color-mix(in srgb, var(--border) 82%, transparent)";
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

              {formError && <p style={{ color: "#D97560", marginBottom: "15px", fontWeight: "bold", position: "relative", zIndex: 1 }}>{formError}</p>}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "15px",
                  background: "linear-gradient(180deg, color-mix(in srgb, var(--accent) 82%, transparent), color-mix(in srgb, var(--accent-strong) 76%, #000 8%))",
                  border: "1px solid color-mix(in srgb, var(--border) 82%, transparent)",
                  color: "var(--panel)",
                  fontSize: "16px",
                  fontFamily: "'Comic Neue', cursive",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  opacity: loading ? 0.6 : 1,
                  position: "relative",
                  zIndex: 1,
                  boxShadow: "0 10px 18px var(--shadow)",
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.transform = "translateY(-3px)";
                    e.target.style.boxShadow = "0 14px 24px var(--shadow)";
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 10px 18px var(--shadow)";
                }}
              >
                {loading ? "Adding..." : "Save Expense"}
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

      <style>{`
        @media (max-width: 1024px) {
          .expenses-layout {
            gap: 28px !important;
          }

          .expenses-form-panel {
            width: 360px !important;
          }
        }

        @media (max-width: 768px) {
          .expenses-page {
            padding: 18px 14px 26px !important;
            overflow-x: hidden;
          }

          .custom-date-picker-root {
            overflow: visible !important;
          }

          .custom-date-picker-popup {
            width: min(360px, calc(100vw - 24px)) !important;
            left: 12px !important;
            right: 12px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            max-width: none !important;
            max-height: calc(100vh - 24px) !important;
            overflow: auto !important;
            z-index: 220 !important;
            box-shadow: 8px 10px 0px rgba(0,0,0,0.18) !important;
          }

          .custom-date-picker-popup .custom-date-picker-header {
            position: sticky;
            top: 0;
            background: #F5F3ED;
            padding-bottom: 6px;
            z-index: 1;
          }

          .custom-date-picker-popup .custom-date-picker-grid button,
          .custom-date-picker-popup .custom-date-picker-grid div {
            height: 36px !important;
          }

          .custom-date-picker-popup .custom-date-picker-grid button {
            font-size: 14px !important;
          }

          .custom-date-picker-popup .custom-date-picker-weekdays div {
            font-size: 10px !important;
          }

          .trades-form-card,
          .expenses-form-card {
            overflow: visible !important;
          }

          .expenses-hero {
            margin-bottom: 18px !important;
          }

          .expenses-hero h1 {
            font-size: 34px !important;
            line-height: 0.95;
            margin-bottom: 8px !important;
          }

          .expenses-hero p {
            font-size: 14px !important;
            max-width: 30ch;
          }

          .expenses-summary-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 12px !important;
            margin-bottom: 18px !important;
          }

          .expenses-summary-card {
            padding: 14px 14px 12px !important;
            border-radius: 18px 12px 18px 12px !important;
            min-height: 92px;
          }

          .expenses-summary-card p:nth-of-type(1) {
            font-size: 11px !important;
          }

          .expenses-summary-card p:nth-of-type(2) {
            font-size: 24px !important;
          }

          .expenses-summary-card p:nth-of-type(3) {
            font-size: 11px !important;
          }

          .expenses-layout {
            flex-direction: column !important;
            gap: 18px !important;
          }

          .expenses-form-panel {
            order: 1 !important;
            width: 100% !important;
            position: static !important;
          }

          .expenses-form-card {
            padding: 20px 16px !important;
            border-radius: 22px 16px 22px 16px !important;
            box-shadow: 5px 6px 0px rgba(0,0,0,0.14) !important;
          }

          .expenses-form-card h2 {
            font-size: 24px !important;
            margin-bottom: 18px !important;
          }

          .expenses-form-card label {
            font-size: 13px !important;
          }

          .expenses-form-card input,
          .expenses-form-card button {
            font-size: 15px !important;
          }

          .expenses-history-panel {
            order: 2 !important;
          }

          .expenses-history-panel h2 {
            font-size: 24px !important;
            margin-bottom: 14px !important;
          }

          .expenses-history-list {
            gap: 12px !important;
          }

          .expense-card {
            padding: 16px 14px 14px 18px !important;
            border-radius: 22px 14px 22px 14px !important;
            box-shadow: 4px 5px 0px rgba(0,0,0,0.12) !important;
            animation-duration: 0.35s !important;
          }

          .expense-card > div:first-child {
            width: 8px !important;
          }

          .expense-card-title {
            font-size: 17px !important;
          }

          .expense-card-value p:first-child {
            font-size: 20px !important;
          }

          .expense-card-details {
            margin-top: 16px !important;
            padding-top: 16px !important;
          }

          .expense-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
            margin-bottom: 14px !important;
          }

          .expense-detail-grid > div {
            padding: 12px !important;
          }

          .expense-detail-grid p:last-child {
            font-size: 18px !important;
          }

          .expenses-orb {
            opacity: 0.85;
          }

          .expenses-orb-a {
            right: -40px !important;
            top: -22px !important;
            width: 130px !important;
            height: 130px !important;
          }

          .expenses-orb-b {
            left: -30px !important;
            bottom: -48px !important;
            width: 160px !important;
            height: 160px !important;
          }

          .expenses-page .card {
            animation-duration: 0.45s;
          }
        }

        @media (max-width: 480px) {
          .expenses-page {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }

          .expenses-summary-grid {
            grid-template-columns: 1fr 1fr !important;
          }

          .expenses-summary-card p:nth-of-type(2) {
            font-size: 22px !important;
          }

          .expense-card-value {
            min-width: 92px;
          }

          .expenses-form-card {
            padding: 18px 14px !important;
          }

          .expenses-form-card h2,
          .expenses-history-panel h2 {
            font-size: 22px !important;
          }
        }
      `}</style>
    </div>
  );
}