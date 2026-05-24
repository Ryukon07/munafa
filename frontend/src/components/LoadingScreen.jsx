import { useEffect, useState } from "react";

export default function LoadingScreen({ theme }) {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 2000);
    const hideTimer = setTimeout(() => setVisible(false), 2500);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  const dark = theme === "dark";
  const border = dark ? "#556575" : "#3a3a3a";
  const text = dark ? "#e6edf5" : "#2f343d";
  const muted = dark ? "#95a6b8" : "#675f58";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: dark
          ? "linear-gradient(180deg,#0d131b 0%,#111a25 100%)"
          : "linear-gradient(180deg,#f6f3ec 0%,#efe6d8 100%)",
        fontFamily: "'Comic Neue', cursive",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.5s ease",
        overflow: "hidden",
      }}
    >
      {/* Blobs */}
      <div style={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", background: "#8a9fb7", opacity: 0.12, top: -80, left: -60, animation: "mlBlob 6s ease-in-out infinite" }} />
      <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "#6d8b7e", opacity: 0.12, bottom: -60, right: -40, animation: "mlBlob 6s ease-in-out infinite 2s" }} />
      <div style={{ position: "absolute", width: 150, height: 150, borderRadius: "50%", background: "#bb6f63", opacity: 0.1, top: "40%", right: "5%", animation: "mlBlob 6s ease-in-out infinite 4s" }} />

      {/* Logo */}
      <h1
        style={{
          fontFamily: "'Bangers', cursive",
          fontSize: "clamp(52px, 12vw, 72px)",
          letterSpacing: 6,
          color: text,
          margin: 0,
          position: "relative",
          zIndex: 2,
          animation: "mlLogoPop 0.7s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        MUNAFA
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontSize: 12,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: muted,
          margin: "4px 0 28px",
          zIndex: 2,
          position: "relative",
          animation: "mlFadeUp 0.6s 0.3s ease both",
        }}
      >
        Your Trading Journal
      </p>

      {/* Coin */}
      <div style={{ position: "relative", zIndex: 2, marginBottom: 28, animation: "mlFadeUp 0.6s 0.5s ease both" }}>
        <div
          style={{
            width: 76,
            height: 76,
            border: "3px solid " + border,
            borderRadius: "14px 18px 12px 16px",
            background: dark ? "#121c29" : "#fdf6ec",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "4px 4px 0 " + border,
            animation: "mlDoodleBorder 3s ease-in-out infinite, mlWobble 2s ease-in-out infinite",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              fontFamily: "'Bangers', cursive",
              fontSize: 36,
              color: text,
              lineHeight: 1,
              animation: "mlRupee 2s ease-in-out infinite",
            }}
          >
            ₹
          </span>
          {[
            { top: 8, right: 10, size: 6, delay: "0s" },
            { bottom: 10, left: 8, size: 4, delay: "0.6s" },
            { top: "50%", left: 4, size: 5, delay: "1.2s" },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                borderRadius: "50%",
                background: "#e8a838",
                width: s.size,
                height: s.size,
                top: s.top,
                right: s.right,
                bottom: s.bottom,
                left: s.left,
                animation: "mlSpark 1.8s ease-in-out infinite " + s.delay,
              }}
            />
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ zIndex: 2, position: "relative", marginBottom: 28, animation: "mlFadeUp 0.6s 0.6s ease both" }}>
        <svg width="160" height="64" viewBox="0 0 160 64">
          {[
            { x: 8,   y: 20, h: 40, fill: "#8a9fb7", delay: "0.7s" },
            { x: 36,  y: 32, h: 28, fill: "#bb6f63", delay: "0.85s" },
            { x: 64,  y: 10, h: 50, fill: "#6d8b7e", delay: "1.0s" },
            { x: 92,  y: 24, h: 36, fill: "#8a9fb7", delay: "0.9s" },
            { x: 120, y: 4,  h: 56, fill: "#6d8b7e", delay: "1.1s" },
          ].map((b, i) => (
            <rect
              key={i}
              x={b.x} y={b.y} width={20} height={b.h} rx={4}
              fill={b.fill}
              stroke={border}
              strokeWidth={2}
              style={{
                transformOrigin: "bottom",
                animation: "mlBarGrow 1.2s cubic-bezier(0.22,1,0.36,1) " + b.delay + " both",
              }}
            />
          ))}
          <line x1="4" y1="62" x2="156" y2="62" stroke={border} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Progress */}
      <div style={{ zIndex: 2, position: "relative", width: 220, animation: "mlFadeUp 0.6s 0.8s ease both" }}>
        <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: muted, marginBottom: 8, textAlign: "center" }}>
          Loading your profits...
        </p>
        <div
          style={{
            width: "100%",
            height: 10,
            background: dark ? "#1d2940" : "#e1d6c7",
            border: "2px solid " + border,
            borderRadius: "8px 12px 10px 14px",
            overflow: "hidden",
            boxShadow: "2px 2px 0 " + border,
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 6,
              background: dark
                ? "linear-gradient(90deg,#7f9eb6,#8ca697)"
                : "linear-gradient(90deg,#8a9fb7,#6d8b7e)",
              animation: "mlFill 2s cubic-bezier(0.22,1,0.36,1) 1s both",
            }}
          />
        </div>

        {/* Dots */}
        <div style={{ display: "flex", gap: 6, marginTop: 14, justifyContent: "center" }}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: dark ? "#7f9eb6" : "#8a9fb7",
                border: "2px solid " + border,
                animation: "mlDot 1.2s ease-in-out infinite " + delay + "s",
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes mlBlob { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.12) translate(10px,-10px)} }
        @keyframes mlLogoPop { from{opacity:0;transform:scale(0.6) rotate(-4deg)} to{opacity:1;transform:scale(1) rotate(0deg)} }
        @keyframes mlFadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes mlDoodleBorder { 0%,100%{border-radius:14px 18px 12px 16px} 25%{border-radius:18px 12px 16px 14px} 50%{border-radius:12px 16px 14px 18px} 75%{border-radius:16px 14px 18px 12px} }
        @keyframes mlWobble { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(1.5deg)} 75%{transform:rotate(-1.5deg)} }
        @keyframes mlRupee { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        @keyframes mlSpark { 0%,100%{opacity:0;transform:scale(0)} 50%{opacity:1;transform:scale(1)} }
        @keyframes mlBarGrow { from{transform:scaleY(0)} to{transform:scaleY(1)} }
        @keyframes mlFill { from{width:0%} to{width:85%} }
        @keyframes mlDot { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      `}</style>
    </div>
  );
}