import { useEffect, useMemo, useRef, useState } from "react";
import { useTrades } from "../hooks/useTrades";

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
      <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
        {label}
      </label>
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
          fontSize: "14px",
          color: "#3A3A3A",
        }}
      >
        ▾
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
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "none",
                borderBottom: "1px solid rgba(58, 58, 58, 0.15)",
                background: option === value ? "rgba(232, 114, 111, 0.12)" : "transparent",
                color: "#3A3A3A",
                textAlign: "left",
                fontFamily: "'Comic Neue', cursive",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              {option}
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
      <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
        {label}
      </label>
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

export default function TradesPage() {
  const { trades, addTrade, deleteTrade, loading, error } = useTrades();
  const symbolRef = useRef(null);
  const buyPriceRef = useRef(null);
  const sellPriceRef = useRef(null);
  const quantityRef = useRef(null);
  const [formError, setFormError] = useState(null);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [tradeType, setTradeType] = useState("Intraday");
  const [tradeDate, setTradeDate] = useState(getTodayValue());
  const [tradeToDelete, setTradeToDelete] = useState(null);

  const summary = useMemo(() => {
    const stats = trades.reduce(
      (accumulator, trade) => {
        const pnl = Number(trade.pnl) || 0;
        accumulator.totalPnl += pnl;
        accumulator.totalTrades += 1;

        if (pnl >= 0) {
          accumulator.winningTrades += 1;
        } else {
          accumulator.losingTrades += 1;
        }

        return accumulator;
      },
      {
        totalPnl: 0,
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
      }
    );

    return {
      ...stats,
      averagePnl: stats.totalTrades ? stats.totalPnl / stats.totalTrades : 0,
    };
  }, [trades]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await addTrade(
        symbolRef.current.value,
        tradeType,
        parseFloat(buyPriceRef.current.value),
        parseFloat(sellPriceRef.current.value),
        parseInt(quantityRef.current.value, 10),
        tradeDate
      );
      e.target.reset();
      setTradeType("Intraday");
      setTradeDate(getTodayValue());
    } catch (err) {
      setFormError(err.message);
    }
  };

  const openDeleteDialog = (trade) => {
    setTradeToDelete(trade);
  };

  const closeDeleteDialog = () => {
    setTradeToDelete(null);
  };

  const confirmDelete = async () => {
    if (!tradeToDelete) return;

    try {
      await deleteTrade(tradeToDelete.id);
      setSelectedTrade(null);
      setTradeToDelete(null);
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

    if (tradeToDelete) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => document.removeEventListener("keydown", handleEscape);
  }, [tradeToDelete]);

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

      <h1 style={{ fontSize: "48px", marginBottom: "40px" }}>📈 Trades</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "16px", marginBottom: "30px" }}>
        <div style={{ background: "#F5F3ED", border: "3px solid #3A3A3A", borderRadius: "14px", padding: "18px", boxShadow: "4px 4px 0px rgba(0,0,0,0.12)" }}>
          <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px", fontWeight: "bold" }}>TOTAL P/L</p>
          <p style={{ fontSize: "28px", fontWeight: "bold", color: summary.totalPnl >= 0 ? "#6BA583" : "#D97560" }}>
            ₹{Math.abs(summary.totalPnl).toFixed(2)}
          </p>
        </div>
        <div style={{ background: "#F5F3ED", border: "3px solid #3A3A3A", borderRadius: "14px", padding: "18px", boxShadow: "4px 4px 0px rgba(0,0,0,0.12)" }}>
          <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px", fontWeight: "bold" }}>WINNING TRADES</p>
          <p style={{ fontSize: "28px", fontWeight: "bold", color: "#6BA583" }}>{summary.winningTrades}</p>
        </div>
        <div style={{ background: "#F5F3ED", border: "3px solid #3A3A3A", borderRadius: "14px", padding: "18px", boxShadow: "4px 4px 0px rgba(0,0,0,0.12)" }}>
          <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px", fontWeight: "bold" }}>LOSING TRADES</p>
          <p style={{ fontSize: "28px", fontWeight: "bold", color: "#D97560" }}>{summary.losingTrades}</p>
        </div>
        <div style={{ background: "#F5F3ED", border: "3px solid #3A3A3A", borderRadius: "14px", padding: "18px", boxShadow: "4px 4px 0px rgba(0,0,0,0.12)" }}>
          <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px", fontWeight: "bold" }}>TOTAL TRADES</p>
          <p style={{ fontSize: "28px", fontWeight: "bold", color: "#3A3A3A" }}>{summary.totalTrades}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "40px" }}>
        {/* Trades History */}
        <div style={{ flex: 1, order: 1 }}>
          <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>📋 Trade History</h2>
          {error && <p style={{ color: "#D97560", marginBottom: "15px", fontWeight: "bold" }}>❌ {error}</p>}

          {trades.length === 0 ? (
            <div
              style={{
                background: "#F5F3ED",
                border: "3px dashed #3A3A3A",
                padding: "50px",
                textAlign: "center",
                borderRadius: "12px",
                color: "#666",
                animation: "slideIn 0.6s ease-out",
              }}
            >
              <p style={{ fontSize: "18px" }}>No trades yet. Add your first trade! 📈</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {trades.map((trade, idx) => (
                <div
                  key={trade.id}
                  onClick={() => setSelectedTrade(selectedTrade === trade.id ? null : trade.id)}
                  style={{
                    background: "#F5F3ED",
                    border: "3px solid #3A3A3A",
                    borderRadius: "12px 10px 14px 16px",
                    padding: "20px",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    boxShadow: selectedTrade === trade.id ? "8px 8px 0px rgba(0,0,0,0.2)" : "3px 3px 0px rgba(0,0,0,0.1)",
                    transform: selectedTrade === trade.id ? "translateY(-8px) rotate(1deg)" : "translateY(0) rotate(0deg)",
                    animation: `slideIn ${0.3 + idx * 0.1}s ease-out`,
                  }}
                  onMouseOver={(e) => {
                    if (selectedTrade !== trade.id) {
                      e.currentTarget.style.transform = "translateY(-4px) rotate(-0.5deg)";
                      e.currentTarget.style.boxShadow = "5px 5px 0px rgba(0,0,0,0.15)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedTrade !== trade.id) {
                      e.currentTarget.style.transform = "translateY(0) rotate(0deg)";
                      e.currentTarget.style.boxShadow = "3px 3px 0px rgba(0,0,0,0.1)";
                    }
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "5px" }}>
                        {trade.symbol} <span style={{ fontSize: "14px", color: "#666" }}>({trade.tradeType})</span>
                      </h3>
                      <p style={{ fontSize: "14px", color: "#666" }}>
                        {new Date(trade.date).toLocaleDateString()} • Qty: {trade.quantity}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: trade.pnl >= 0 ? "#6BA583" : "#D97560",
                        marginBottom: "5px",
                      }}>
                        ₹{trade.pnl.toFixed(2)}
                      </p>
                      <p style={{ fontSize: "12px", color: "#666" }}>
                        {selectedTrade === trade.id ? "▼ Click to collapse" : "▶ Click to expand"}
                      </p>
                    </div>
                  </div>

                  {selectedTrade === trade.id && (
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
                          <p style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>BUY PRICE</p>
                          <p style={{ fontSize: "20px", fontWeight: "bold" }}>₹{trade.buyPrice}</p>
                        </div>
                        <div style={{ background: "#FAF8F3", padding: "15px", borderRadius: "8px", border: "2px solid #3A3A3A" }}>
                          <p style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>SELL PRICE</p>
                          <p style={{ fontSize: "20px", fontWeight: "bold" }}>₹{trade.sellPrice}</p>
                        </div>
                        <div style={{ background: "#FAF8F3", padding: "15px", borderRadius: "8px", border: "2px solid #3A3A3A" }}>
                          <p style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>QUANTITY</p>
                          <p style={{ fontSize: "20px", fontWeight: "bold" }}>{trade.quantity} units</p>
                        </div>
                        <div style={{ background: "#FAF8F3", padding: "15px", borderRadius: "8px", border: "2px solid #3A3A3A" }}>
                          <p style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>PROFIT/LOSS</p>
                          <p style={{ fontSize: "20px", fontWeight: "bold", color: trade.pnl >= 0 ? "#6BA583" : "#D97560" }}>
                            ₹{trade.pnl.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteDialog(trade);
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
                        🗑️ Delete Trade
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Card - Sticky */}
        <div
          style={{
            width: "400px",
            position: "sticky",
            top: "20px",
            height: "fit-content",
            order: 2,
          }}
        >
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
            <h2 style={{ fontSize: "28px", marginBottom: "25px" }}>➕ Add New Trade</h2>
            <form onSubmit={handleSubmit}>
  <div style={{ marginBottom: "20px" }}>
    <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
      Symbol (Stock/Index)
    </label>
    <input
      ref={symbolRef}
      defaultValue=""
      type="text"
      placeholder="e.g., AAPL, NIFTY50"
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
                label="Trade Type"
                value={tradeType}
                onChange={setTradeType}
                options={["Intraday", "Delivery", "Futures", "MTF", "Options"]}
              />

  <div style={{ marginBottom: "20px" }}>
    <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
      Buy Price (₹)
    </label>
    <input
      ref={buyPriceRef}
      defaultValue=""
      type="number"
      step="0.01"
      placeholder="Entry price"
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
    <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
      Sell Price (₹)
    </label>
    <input
      ref={sellPriceRef}
      defaultValue=""
      type="number"
      step="0.01"
      placeholder="Exit price"
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
    <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
      Quantity
    </label>
    <input
      ref={quantityRef}
      defaultValue=""
      type="number"
      placeholder="Number of units"
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

              <CustomDatePicker label="Date" value={tradeDate} onChange={setTradeDate} />

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
    {loading ? "Adding..." : "🚀 Add Trade"}
  </button>
</form>
          </div>
        </div>
      </div>

      {tradeToDelete && (
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
                <h3 style={{ fontSize: "26px", marginBottom: "4px" }}>Delete Trade?</h3>
                <p style={{ color: "#666", fontSize: "14px" }}>
                  This will permanently remove {tradeToDelete.symbol} from your trade history.
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
                <span style={{ color: "#666", fontSize: "13px" }}>Symbol</span>
                <span style={{ fontWeight: "bold" }}>{tradeToDelete.symbol}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "8px" }}>
                <span style={{ color: "#666", fontSize: "13px" }}>Type</span>
                <span style={{ fontWeight: "bold" }}>{tradeToDelete.tradeType}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                <span style={{ color: "#666", fontSize: "13px" }}>P/L</span>
                <span style={{ fontWeight: "bold", color: tradeToDelete.pnl >= 0 ? "#6BA583" : "#D97560" }}>
                  ₹{tradeToDelete.pnl.toFixed(2)}
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