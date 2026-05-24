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

  const statsCards = [
    {
      title: "Total P&L",
      value: stats.totalPnL,
      color: getMetricTone(stats.totalPnL).color,
      isNegative: stats.totalPnL < 0,
      accent: "#6BA583",
      label: "Trading result",
    },
    {
      title: "Total Expenses",
      value: stats.totalExpenses,
      color: getMetricTone(-stats.totalExpenses).color,
      isNegative: stats.totalExpenses > 0,
      accent: "#D97560",
      label: "Net spend",
    },
    {
      title: "Net Balance",
      value: stats.netBalance,
      color: getMetricTone(stats.netBalance).color,
      isNegative: stats.netBalance < 0,
      accent: "#3A3A3A",
      label: "Actual position",
    },
  ];

  const pnlTrades = trades.filter((trade) => trade.pnl > 0).length;
  const lossTrades = trades.filter((trade) => trade.pnl < 0).length;
  const debitEntries = expenses.filter((expense) => expense.type === "debit").length;
  const creditEntries = expenses.filter((expense) => expense.type === "credit").length;

  const CircleCard = ({ title, value, color, onClick, progress }) => (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        textAlign: "center",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-5px) scale(1.03)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
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
      <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>Tap for details</p>
    </div>
  );

  const StatCard = ({ title, value, color, isNegative, label, accent }) => (
    <div
      className="card dashboard-stat-card"
      style={{
        background: "#F5F3ED",
        border: "3px solid #3A3A3A",
        padding: "30px",
        borderRadius: "12px 16px 10px 14px",
        boxShadow: "4px 4px 0px rgba(0,0,0,0.12)",
        textAlign: "center",
        transition: "all 0.3s ease",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
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
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "8px",
          background: `linear-gradient(90deg, ${accent}, transparent)`,
        }}
      />
      <div style={{ fontSize: "12px", letterSpacing: "2px", color: "#666", marginBottom: "12px" }}>
        {label}
      </div>
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
    <div className="dashboard-page" style={{ padding: "40px", background: "#FAF8F3", minHeight: "100vh" }}>
      <div
        aria-hidden="true"
        className="dashboard-orb dashboard-orb-one"
        style={{
          position: "fixed",
          top: "120px",
          right: "-70px",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,114,111,0.2), rgba(232,114,111,0))",
          filter: "blur(2px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        className="dashboard-orb dashboard-orb-two"
        style={{
          position: "fixed",
          bottom: "40px",
          left: "-80px",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(107,165,131,0.16), rgba(107,165,131,0))",
          filter: "blur(2px)",
          pointerEvents: "none",
        }}
      />
      {/* Header */}
      <div className="dashboard-header" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "50px",
        animation: "slideIn 0.6s ease-out",
        gap: "20px",
        position: "relative",
      }}>
        <div style={{ maxWidth: "680px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 14px",
              border: "1px solid color-mix(in srgb, var(--border) 82%, transparent)",
              borderRadius: "999px",
              background: "color-mix(in srgb, var(--surface) 88%, transparent)",
              boxShadow: "0 10px 18px var(--shadow)",
              marginBottom: "16px",
              fontSize: "13px",
              fontWeight: "bold",
              color: "var(--text)",
            }}
          >
            <span style={{ color: "var(--accent)" }}>●</span>
            Live summary
          </div>
          <h1 style={{ fontSize: "48px", marginBottom: "10px", color: "var(--text)" }}>Dashboard</h1>
          <p style={{ fontSize: "16px", color: "var(--muted)" }}>Welcome back, {user?.name}.</p>
        </div>
        <button
          onClick={onLogout}
          style={{
            display: "none",
            background: "#D97560",
            border: "3px solid #3A3A3A",
            color: "#FAF8F3",
            padding: "12px 16px",
            borderRadius: "999px",
            fontSize: "14px",
            fontFamily: "'Comic Neue', cursive",
            fontWeight: "bold",
            boxShadow: "3px 3px 0px rgba(0,0,0,0.12)",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "30px",
        marginBottom: "50px",
      }}>
        {statsCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            color={card.color}
            isNegative={card.isNegative}
            label={card.label}
            accent={card.accent}
          />
        ))}
      </div>

      {/* Chart */}
      <div
        className="card dashboard-overview"
        style={{
          background: "#F5F3ED",
          border: "3px solid #3A3A3A",
          padding: "40px",
          borderRadius: "14px 12px 16px 10px",
          boxShadow: "4px 4px 0px rgba(0,0,0,0.12)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "auto -40px -40px auto",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(216, 114, 111, 0.12), rgba(216, 114, 111, 0))",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "end", marginBottom: "24px", position: "relative", zIndex: 1 }}>
          <div>
            <div style={{ fontSize: "13px", letterSpacing: "2px", color: "#666", marginBottom: "6px" }}>OVERVIEW</div>
            <h2 style={{ fontSize: "28px" }}>Overview</h2>
          </div>
        </div>
        
        <div className="dashboard-circle-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "40px",
          alignItems: "center",
          justifyItems: "center",
          position: "relative",
          zIndex: 1,
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

      <div className="dashboard-mobile-story" style={{ display: "none" }}>
        <div className="dashboard-mobile-story-header">
          <div>Fast glance</div>
        </div>
        <div className="dashboard-mobile-story-grid">
          <div className="dashboard-mobile-story-chip">
            <span>Trades</span>
            <strong>{trades.length}</strong>
          </div>
          <div className="dashboard-mobile-story-chip">
            <span>Wins</span>
            <strong>{pnlTrades}</strong>
          </div>
          <div className="dashboard-mobile-story-chip">
            <span>Losses</span>
            <strong>{lossTrades}</strong>
          </div>
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
          {expandedCard === "pnl" && "P&L Summary"}
          {expandedCard === "expenses" && "Expenses Summary"}
          {expandedCard === "net" && "Net Balance Summary"}
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
    minWidth: "72px",
    height: "40px",
    borderRadius: "999px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  }}
>
  Close
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
            <p style={{ fontSize: "13px", marginBottom: "5px" }}>• Winning Trades: {pnlTrades}</p>
            <p style={{ fontSize: "13px", marginBottom: "5px" }}>• Losing Trades: {lossTrades}</p>
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
            <p style={{ fontSize: "13px", marginBottom: "5px" }}>• Total Expense Entries: {debitEntries}</p>
            <p style={{ fontSize: "13px", marginBottom: "5px" }}>• Refunds Received: {creditEntries}</p>
            <p style={{ fontSize: "13px" }}>• Average per Expense Entry: ₹{debitEntries > 0 ? (stats.totalExpenses / debitEntries).toFixed(2) : 0}</p>
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
              Status: {stats.netBalance >= 0 ? "Profitable" : "Loss"}
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

      <style>{`
        .dashboard-mobile-story {
          margin-top: 26px;
        }

        .dashboard-mobile-story-header {
          display: none;
        }

        .dashboard-mobile-story-grid {
          display: none;
        }

        @media (max-width: 768px) {
          .dashboard-page {
            padding: 18px 14px 28px !important;
          }

          .dashboard-header {
            flex-direction: column;
            margin-bottom: 24px !important;
          }

          .dashboard-header h1 {
            font-size: 34px !important;
            line-height: 0.95;
          }

          .dashboard-header p {
            font-size: 14px !important;
          }

          .dashboard-stats-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            margin-bottom: 22px !important;
          }

          .dashboard-stat-card {
            padding: 20px 18px !important;
            border-radius: 18px 14px 18px 14px !important;
          }

          .dashboard-overview {
            padding: 18px 14px 20px !important;
            border-radius: 22px 18px 22px 18px !important;
          }

          .dashboard-overview h2 {
            font-size: 24px !important;
          }

          .dashboard-circle-grid {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }

          .dashboard-circle-grid > div {
            width: 100%;
            max-width: 290px;
          }

          .dashboard-mobile-story {
            display: block !important;
          }

          .dashboard-mobile-story-header {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: center;
            margin-bottom: 14px;
            padding: 0 4px;
            font-size: 12px;
            letter-spacing: 1.5px;
            color: #666;
            text-transform: uppercase;
          }

          .dashboard-mobile-story-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }

          .dashboard-mobile-story-chip {
            background: linear-gradient(180deg, #F5F3ED 0%, #EDE5D8 100%);
            border: 3px solid #3A3A3A;
            border-radius: 16px 12px 16px 12px;
            padding: 12px 10px;
            box-shadow: 3px 3px 0 rgba(0,0,0,0.12);
            display: flex;
            flex-direction: column;
            gap: 4px;
            align-items: center;
            text-align: center;
            animation: slideIn 0.5s ease-out;
          }

          .dashboard-mobile-story-chip span {
            font-size: 11px;
            letter-spacing: 1.4px;
            color: #666;
          }

          .dashboard-mobile-story-chip strong {
            font-size: 22px;
            font-family: 'Bangers', cursive;
            letter-spacing: 1px;
          }

          .dashboard-orb {
            opacity: 0.7;
          }

          .dashboard-orb-one {
            top: 80px !important;
            right: -110px !important;
            width: 220px !important;
            height: 220px !important;
          }

          .dashboard-orb-two {
            bottom: 20px !important;
            left: -130px !important;
            width: 240px !important;
            height: 240px !important;
          }

          .dashboard-page .card {
            animation-duration: 0.45s;
          }

          .dashboard-page [style*="position: fixed"] {
            touch-action: manipulation;
          }

          .dashboard-page .dashboard-overview > div:first-child {
            align-items: flex-start !important;
          }

          .dashboard-page .dashboard-overview > div:first-child > div:last-child {
            font-size: 12px !important;
          }

          .dashboard-page .dashboard-overview h2 {
            margin-bottom: 0;
          }
        }

        @media (max-width: 480px) {
          .dashboard-header h1 {
            font-size: 30px !important;
          }

          .dashboard-mobile-story-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }

          .dashboard-circle-grid > div {
            max-width: 100%;
          }

          .dashboard-page .card,
          .dashboard-stat-card,
          .dashboard-overview {
            box-shadow: 3px 3px 0px rgba(0,0,0,0.12) !important;
          }
        }
      `}</style>
    </div>
  );
}