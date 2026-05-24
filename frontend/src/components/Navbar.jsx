import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ user, onLogout, theme, onToggleTheme }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDark = theme === "dark";

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    onLogout();
    navigate("/login");
  };

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  if (!user) return null;

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Trades", path: "/trades" },
    { label: "Expenses", path: "/expenses" },
  ];

  const navigateAndClose = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <nav
      className="app-navbar"
      style={{
        backgroundColor: "#E8726F",
        color: "#3A3A3A",
        padding: "18px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "4px solid #3A3A3A",
        boxShadow: "3px 3px 0px rgba(0,0,0,0.15)",
        animation: "slideIn 0.5s ease-out",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          fontFamily: "'Bangers', cursive",
          letterSpacing: "3px",
          textShadow: "2px 2px 0px rgba(255,255,255,0.3)",
          lineHeight: 1,
        }}
      >
        MUNAFA
      </div>

      <div className="navbar-desktop-actions" style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        {navItems.map((btn) => (
          <button
            key={btn.path}
            onClick={() => navigateAndClose(btn.path)}
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
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "4px 6px 0px rgba(0,0,0,0.15)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "2px 2px 0px rgba(0,0,0,0.1)";
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
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "4px 6px 0px rgba(0,0,0,0.15)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "2px 2px 0px rgba(0,0,0,0.1)";
          }}
        >
          Logout
        </button>
      </div>

      <button
        type="button"
        className="navbar-mobile-toggle"
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen((current) => !current)}
        style={{
          display: "none",
          width: "48px",
          height: "48px",
          borderRadius: "14px",
          border: "3px solid #3A3A3A",
          background: "#F5F3ED",
          color: "#3A3A3A",
          boxShadow: "2px 2px 0px rgba(0,0,0,0.1)",
          cursor: "pointer",
          position: "relative",
          zIndex: 121,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        <span
          style={{
            width: "18px",
            height: "3px",
            borderRadius: "999px",
            background: "currentColor",
            transform: isMobileMenuOpen ? "translateY(8px) rotate(45deg)" : "none",
            transition: "transform 0.25s ease",
          }}
        />
        <span
          style={{
            width: "18px",
            height: "3px",
            borderRadius: "999px",
            background: "currentColor",
            opacity: isMobileMenuOpen ? 0 : 1,
            transition: "opacity 0.2s ease",
          }}
        />
        <span
          style={{
            width: "18px",
            height: "3px",
            borderRadius: "999px",
            background: "currentColor",
            transform: isMobileMenuOpen ? "translateY(-8px) rotate(-45deg)" : "none",
            transition: "transform 0.25s ease",
          }}
        />
      </button>

      <div
        className="navbar-mobile-backdrop"
        onClick={() => setIsMobileMenuOpen(false)}
        style={{
          display: isMobileMenuOpen ? "block" : "none",
          position: "fixed",
          inset: 0,
          background: "rgba(58, 58, 58, 0.4)",
          backdropFilter: "blur(2px)",
          zIndex: 110,
        }}
      />

      <aside
        className="navbar-mobile-drawer"
        style={{
          position: "fixed",
          top: "12px",
          right: "12px",
          bottom: "12px",
          width: "min(86vw, 340px)",
          background: isDark
            ? "radial-gradient(circle at top right, rgba(255, 255, 255, 0.06), transparent 28%), linear-gradient(180deg, color-mix(in srgb, var(--surface) 90%, transparent), color-mix(in srgb, var(--surface-2) 96%, transparent))"
            : "radial-gradient(circle at top right, rgba(250, 248, 243, 0.28), transparent 30%), linear-gradient(180deg, #E8726F 0%, #D97560 100%)",
          border: "1px solid color-mix(in srgb, var(--border) 82%, transparent)",
          borderRight: "0",
          borderRadius: "32px 0 0 32px",
          boxShadow: "-12px 14px 0 var(--shadow)",
          transform: isMobileMenuOpen ? "translateX(0)" : "translateX(110%)",
          transition: "transform 0.3s ease",
          zIndex: 120,
          padding: "16px 16px 18px 18px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          className="navbar-mobile-drawer-stripe"
          style={{
            position: "absolute",
            inset: "0 auto 0 0",
            width: "22px",
            background: isDark
              ? "linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02)), repeating-linear-gradient(180deg, rgba(255,255,255,0.12) 0 10px, rgba(255,255,255,0.04) 10px 20px)"
              : "linear-gradient(180deg, rgba(250,248,243,0.28), rgba(250,248,243,0.08)), repeating-linear-gradient(180deg, rgba(58,58,58,0.22) 0 10px, rgba(58,58,58,0.08) 10px 20px)",
            borderRight: "1px solid color-mix(in srgb, var(--border) 82%, transparent)",
          }}
        />

        <div
          aria-hidden="true"
          className="navbar-mobile-drawer-orb"
          style={{
            position: "absolute",
            top: "18px",
            right: "-14px",
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            border: "1px solid color-mix(in srgb, var(--border) 82%, transparent)",
            background: "var(--panel)",
            boxShadow: "-3px 3px 0 var(--shadow)",
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "34px",
            right: "22px",
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "rgba(250,248,243,0.12)",
            filter: "blur(1px)",
          }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", position: "relative", zIndex: 2, marginTop: "-10px" }}>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: "relative",
              zIndex: 3,
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              border: "3px solid #3A3A3A",
              background: "#F5F3ED",
              color: "#3A3A3A",
              fontSize: "22px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "2px 2px 0px rgba(0,0,0,0.1)",
            }}
          >
            ×
          </button>
        </div>

        <div
          className="navbar-mobile-drawer-panel"
          style={{
            color: "var(--text)",
            padding: "10px 10px 8px 28px",
            marginRight: "10px",
            marginTop: "4px",
            border: "1px solid color-mix(in srgb, var(--border) 76%, transparent)",
            borderRadius: "24px 10px 24px 10px",
            background: "color-mix(in srgb, var(--surface-2) 88%, transparent)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
            position: "relative",
          }}
        >
          <div style={{ fontSize: "12px", letterSpacing: "2.5px", opacity: 0.95 }}>NAVIGATION</div>
          <div style={{ fontSize: "28px", fontFamily: "'Bangers', cursive", letterSpacing: "2px", lineHeight: 0.95 }}>
            Quick jump
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "10px",
            paddingLeft: "18px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {navItems.map((btn) => (
            <button
              key={btn.path}
              onClick={() => navigateAndClose(btn.path)}
              style={{
                width: "100%",
                background:
                  "linear-gradient(180deg, color-mix(in srgb, var(--surface) 96%, white 4%) 0%, color-mix(in srgb, var(--surface-2) 96%, white 4%) 100%)",
                border: "1px solid color-mix(in srgb, var(--border) 82%, transparent)",
                color: "var(--text)",
                padding: "14px 16px 14px 18px",
                cursor: "pointer",
                fontSize: "17px",
                fontFamily: "'Comic Neue', cursive",
                fontWeight: "bold",
                borderRadius: "18px 10px 18px 10px",
                boxShadow: "0 10px 18px var(--shadow)",
                textAlign: "left",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "10px",
                    background: isDark
                      ? "linear-gradient(180deg, var(--accent) 0%, var(--accent-strong) 100%)"
                      : "linear-gradient(180deg, #E8726F 0%, #D97560 100%)",
                }}
              />
              {btn.label}
            </button>
          ))}

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              background: "linear-gradient(180deg, color-mix(in srgb, var(--danger) 28%, var(--surface-3)) 0%, color-mix(in srgb, var(--danger) 18%, var(--surface-2)) 100%)",
              border: "1px solid color-mix(in srgb, var(--border) 82%, transparent)",
              color: "var(--text)",
              padding: "14px 16px",
              cursor: "pointer",
              fontSize: "17px",
              fontFamily: "'Comic Neue', cursive",
              fontWeight: "bold",
              borderRadius: "18px 10px 18px 10px",
              boxShadow: "0 10px 18px var(--shadow)",
              textAlign: "left",
              marginTop: "6px",
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .navbar-desktop-actions {
            display: none !important;
          }

          .navbar-mobile-toggle {
            display: flex !important;
          }

          .navbar-mobile-drawer-orb {
            display: none !important;
          }

          .navbar-mobile-drawer {
            padding-top: 16px !important;
          }
        }

        @media (min-width: 769px) {
          .navbar-mobile-backdrop,
          .navbar-mobile-drawer,
          .navbar-mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}