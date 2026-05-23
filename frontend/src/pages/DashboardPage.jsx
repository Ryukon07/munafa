import { useState, useEffect } from "react";
import { useTrades } from "../hooks/useTrades";
import { useExpenses } from "../hooks/useExpenses";

export default function DashboardPage({ user, onLogout }) {
  const { trades } = useTrades();
  const { expenses } = useExpenses();
  const [expandedCard, setExpandedCard] = useState(null);
  const [stats, setStats] = useState({
    totalPnL: 0,
    totalExpenses: 0,
    netBalance: 0,
  });

  useEffect(() => {
    const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0);
    const grossExpenses = expenses
      .filter((e) => e.type === "debit")
      .reduce((sum, e) => sum + e.amount, 0);
    const totalCredits = expenses
      .filter((e) => e.type === "credit")
      .reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = grossExpenses - totalCredits;

    const netBalance = totalPnL - totalExpenses;

    setStats({
      totalPnL,
      totalExpenses,
      netBalance,
    });
  }, [trades, expenses]);

  const ringBasis = Math.max(
    Math.abs(stats.totalPnL),
    Math.abs(stats.totalExpenses),
    Math.abs(stats.netBalance),
    1
  );

  const getMetricTone = (value, fallbackPositiveColor = "#6BA583") => ({
    color: value >= 0 ? fallbackPositiveColor : "#D97560",
  });

  const formatCurrency = (value) => `₹${Math.abs(value).toFixed(2)}`;

  const chartData = [
    { name: "P&L", value: stats.totalPnL },
    { name: "Expenses", value: -stats.totalExpenses },
    { name: "Net", value: stats.netBalance },
  ];

  const CircleCard = ({ title, value, color, onClick, progress }) => (
  <div
    onClick={onClick}
    style={{
      cursor: "pointer",
      textAlign: "center",
      transition: "all 0.3s ease",
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = "scale(1.08)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = "scale(1)";
    }}
  >
    <div
      style={{
        width: "150px",
        height: "150px",
        borderRadius: "50%",
        background: `conic-gradient(${color} 0deg ${Math.min(360, progress * 360)}deg, #E8D5C4 ${Math.min(360, progress * 360)}deg 360deg)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "4px solid #3A3A3A",
        position: "relative",
        boxShadow: "4px 4px 0px rgba(0,0,0,0.15)",
        margin: "0 auto 15px",
      }}
    >
      <div
        style={{
          width: "130px",
          height: "130px",
          borderRadius: "50%",
          background: "#F5F3ED",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: "24px", fontWeight: "bold", color }}>
          {formatCurrency(value)}
        </span>
        <span style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>{title}</span>
      </div>
    </div>
    <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>Click for details</p>
  </div>
);

  const StatCard = ({ title, value, color, isNegative }) => (
    <div
      className="card"
      style={{
        background: "#F5F3ED",
        border: "3px solid #3A3A3A",
        padding: "30px",
        borderRadius: "12px 16px 10px 14px",
        boxShadow: "4px 4px 0px rgba(0,0,0,0.12)",
        textAlign: "center",
        transition: "all 0.3s ease",
        cursor: "default",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "6px 8px 0px rgba(0,0,0,0.18)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "4px 4px 0px rgba(0,0,0,0.12)";
      }}
    >
      <h3 style={{ fontSize: "18px", marginBottom: "15px", fontStyle: "italic" }}>
        {title}
      </h3>
      <p
        style={{
          fontSize: "36px",
          fontWeight: "bold",
          color: isNegative ? "#D97560" : color,
          textShadow: "2px 2px 0px rgba(0,0,0,0.1)",
        }}
      >
        {formatCurrency(value)}
      </p>
    </div>
  );

  return (
    <div style={{ padding: "40px", background: "#FAF8F3", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "50px",
          animation: "slideIn 0.6s ease-out",
        }}
      >
        <div>
          <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>📊 Dashboard</h1>
          <p style={{ fontSize: "16px", color: "#666" }}>Welcome back, {user?.name}! 🎉</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "30px",
          marginBottom: "50px",
        }}
      >
        <StatCard
          title="Total P&L"
          value={stats.totalPnL}
          color={getMetricTone(stats.totalPnL).color}
          isNegative={stats.totalPnL < 0}
        />
        <StatCard
          title="Total Expenses"
          value={stats.totalExpenses}
          color={getMetricTone(-stats.totalExpenses).color}
          isNegative={stats.totalExpenses > 0}
        />
        <StatCard
          title="Net Balance"
          value={stats.netBalance}
          color={getMetricTone(stats.netBalance).color}
          isNegative={stats.netBalance < 0}
        />
      </div>

{/* Chart */}
<div
  className="card"
  style={{
    background: "#F5F3ED",
    border: "3px solid #3A3A3A",
    padding: "40px",
    borderRadius: "14px 12px 16px 10px",
    boxShadow: "4px 4px 0px rgba(0,0,0,0.12)",
  }}
>
  <h2 style={{ fontSize: "28px", marginBottom: "40px" }}>📈 Overview</h2>
  
  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "40px",
    alignItems: "center",
    justifyItems: "center",
  }}>
    {/* P&L Circle */}
    <CircleCard
      title="P&L"
      value={stats.totalPnL}
      color={getMetricTone(stats.totalPnL).color}
      onClick={() => setExpandedCard("pnl")}
      progress={Math.abs(stats.totalPnL) / ringBasis}
    />

    {/* Expenses Circle */}
    <CircleCard
      title="Expenses"
      value={-stats.totalExpenses}
      color={getMetricTone(-stats.totalExpenses).color}
      onClick={() => setExpandedCard("expenses")}
      progress={Math.abs(stats.totalExpenses) / ringBasis}
    />

    {/* Net Balance Circle */}
    <CircleCard
      title="Net"
      value={stats.netBalance}
      color={getMetricTone(stats.netBalance).color}
      onClick={() => setExpandedCard("net")}
      progress={Math.abs(stats.netBalance) / ringBasis}
    />
  </div>
</div>

{/* Modal */}
{expandedCard && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      animation: "slideIn 0.3s ease-out",
    }}
    onClick={() => setExpandedCard(null)}
  >
    <div
  onClick={(e) => e.stopPropagation()}
  style={{
    background: "#F5F3ED",
    border: "4px solid #3A3A3A",
    padding: "40px",
    paddingTop: "60px",  // ADD THIS for close button space
    borderRadius: "16px 14px 12px 18px",
    boxShadow: "8px 8px 0px rgba(0,0,0,0.25)",
    maxWidth: "500px",
    animation: "slideIn 0.4s ease-out",
    position: "relative",
  }}
>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ fontSize: "32px" }}>
          {expandedCard === "pnl" && "📊 P&L Summary"}
          {expandedCard === "expenses" && "💸 Expenses Summary"}
          {expandedCard === "net" && "💰 Net Balance Summary"}
        </h2>
        <button
  onClick={() => setExpandedCard(null)}
  style={{
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "#D97560",
    border: "2px solid #3A3A3A",
    color: "#FAF8F3",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "20px",
    fontWeight: "bold",
  }}
>
  ✕
</button>
      </div>

      {expandedCard === "pnl" && (
        <div>
          <div style={{ marginBottom: "20px", padding: "15px", background: "#F0EBE0", border: "2px solid #3A3A3A", borderRadius: "8px" }}>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: getMetricTone(stats.totalPnL).color }}>
              {formatCurrency(stats.totalPnL)}
            </p>
            <p style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>Total Profit/Loss from trading</p>
          </div>
          <div style={{ background: "#F0EBE0", padding: "15px", borderRadius: "8px", border: "2px dashed #3A3A3A" }}>
            <p style={{ fontSize: "14px", marginBottom: "10px" }}><strong>Breakdown:</strong></p>
            <p style={{ fontSize: "13px", marginBottom: "5px" }}>• Total Trades: {trades.length}</p>
            <p style={{ fontSize: "13px", marginBottom: "5px" }}>• Winning Trades: {trades.filter(t => t.pnl > 0).length}</p>
            <p style={{ fontSize: "13px", marginBottom: "5px" }}>• Losing Trades: {trades.filter(t => t.pnl < 0).length}</p>
            <p style={{ fontSize: "13px" }}>• Average P&L: ₹{trades.length > 0 ? (stats.totalPnL / trades.length).toFixed(2) : 0}</p>
          </div>
        </div>
      )}

      {expandedCard === "expenses" && (
        <div>
          <div style={{ marginBottom: "20px", padding: "15px", background: "#F0EBE0", border: "2px solid #3A3A3A", borderRadius: "8px" }}>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: getMetricTone(-stats.totalExpenses).color }}>
              {formatCurrency(stats.totalExpenses)}
            </p>
            <p style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>Net expenses after refunds</p>
          </div>
          <div style={{ background: "#F0EBE0", padding: "15px", borderRadius: "8px", border: "2px dashed #3A3A3A" }}>
            <p style={{ fontSize: "14px", marginBottom: "10px" }}><strong>Breakdown:</strong></p>
            <p style={{ fontSize: "13px", marginBottom: "5px" }}>• Total Expense Entries: {expenses.filter(e => e.type === "debit").length}</p>
            <p style={{ fontSize: "13px", marginBottom: "5px" }}>• Refunds Received: {expenses.filter(e => e.type === "credit").length}</p>
            <p style={{ fontSize: "13px" }}>• Average per Expense Entry: ₹{expenses.filter(e => e.type === "debit").length > 0 ? (stats.totalExpenses / expenses.filter(e => e.type === "debit").length).toFixed(2) : 0}</p>
          </div>
        </div>
      )}

      {expandedCard === "net" && (
        <div>
          <div style={{ marginBottom: "20px", padding: "15px", background: "#F0EBE0", border: "2px solid #3A3A3A", borderRadius: "8px" }}>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: getMetricTone(stats.netBalance).color }}>
              {formatCurrency(stats.netBalance)}
            </p>
            <p style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>Your actual net profit/loss</p>
          </div>
          <div style={{ background: "#F0EBE0", padding: "15px", borderRadius: "8px", border: "2px dashed #3A3A3A" }}>
            <p style={{ fontSize: "14px", marginBottom: "10px" }}><strong>Calculation:</strong></p>
            <p style={{ fontSize: "13px", marginBottom: "5px" }}>P&L: {formatCurrency(stats.totalPnL)}</p>
            <p style={{ fontSize: "13px", marginBottom: "5px" }}>Expenses: {formatCurrency(stats.totalExpenses)}</p>
            <p style={{ fontSize: "13px", marginBottom: "10px" }}>Net: {formatCurrency(stats.netBalance)}</p>
            <p style={{ fontSize: "13px", fontWeight: "bold", color: getMetricTone(stats.netBalance).color }}>
              Status: {stats.netBalance >= 0 ? "✅ Profitable" : "⚠️ Loss"}
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setExpandedCard(null)}
        style={{
          marginTop: "25px",
          width: "100%",
          background: "#E8726F",
          border: "3px solid #3A3A3A",
          color: "#FAF8F3",
          padding: "15px",
          fontSize: "16px",
          fontFamily: "'Comic Neue', cursive",
          fontWeight: "bold",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          e.target.style.transform = "translateY(-3px)";
          e.target.style.boxShadow = "4px 6px 0px rgba(0,0,0,0.15)";
        }}
        onMouseOut={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "none";
        }}
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
}