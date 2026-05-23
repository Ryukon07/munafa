import { useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav style={{
      backgroundColor: "#E8726F",
      color: "#3A3A3A",
      padding: "20px 30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "4px solid #3A3A3A",
      boxShadow: "3px 3px 0px rgba(0,0,0,0.15)",
      animation: "slideIn 0.5s ease-out",
    }}>
      <div style={{
        fontSize: "32px",
        fontWeight: "bold",
        fontFamily: "'Bangers', cursive",
        letterSpacing: "3px",
        textShadow: "2px 2px 0px rgba(255,255,255,0.3)",
      }}>
        🎯 MUNAFA
      </div>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        {[
          { label: "📊 Dashboard", path: "/dashboard" },
          { label: "📈 Trades", path: "/trades" },
          { label: "💸 Expenses", path: "/expenses" },
        ].map((btn) => (
          <button
            key={btn.path}
            onClick={() => navigate(btn.path)}
            style={{
              background: "#F5F3ED",
              border: "3px solid #3A3A3A",
              padding: "10px 18px",
              cursor: "pointer",
              fontSize: "16px",
              fontFamily: "'Comic Neue', cursive",
              fontWeight: "bold",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              boxShadow: "2px 2px 0px rgba(0,0,0,0.1)",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-3px)";
              e.target.style.boxShadow = "4px 6px 0px rgba(0,0,0,0.15)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "2px 2px 0px rgba(0,0,0,0.1)";
            }}
          >
            {btn.label}
          </button>
        ))}
        <button
          onClick={handleLogout}
          style={{
            background: "#D97560",
            border: "3px solid #3A3A3A",
            color: "#FAF8F3",
            padding: "10px 18px",
            cursor: "pointer",
            fontSize: "16px",
            fontFamily: "'Comic Neue', cursive",
            fontWeight: "bold",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            boxShadow: "2px 2px 0px rgba(0,0,0,0.1)",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-3px)";
            e.target.style.boxShadow = "4px 6px 0px rgba(0,0,0,0.15)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "2px 2px 0px rgba(0,0,0,0.1)";
          }}
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}