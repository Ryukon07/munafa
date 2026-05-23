import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../utils/api";

const getTodayValue = () => new Date().toISOString().split("T")[0];

export default function LoginPage({ setUser, user }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

  const handleModeToggle = () => {
    setError(null);
    setShowPassword(false);
    setIsRegister((current) => !current);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address like name@example.com.");
      setLoading(false);
      return;
    }

    if (isRegister) {
      if (!trimmedName) {
        setError("Please enter your name.");
        setLoading(false);
        return;
      }

      if (trimmedPassword.length < 6) {
        setError("Password must be at least 6 characters long.");
        setLoading(false);
        return;
      }
    }

    try {
      const response = isRegister
        ? await authAPI.register(trimmedName, trimmedEmail, trimmedPassword)
        : await authAPI.login(trimmedEmail, trimmedPassword);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      navigate("/dashboard", { replace: true });
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || (isRegister ? "Registration failed" : "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(232, 114, 111, 0.18), transparent 30%), radial-gradient(circle at top right, rgba(107, 165, 131, 0.16), transparent 26%), linear-gradient(180deg, #FAF8F3 0%, #F8EEDB 100%)",
        position: "relative",
        overflow: "hidden",
        padding: "32px 20px",
      }}
    >
      <style>{`
        @keyframes floatIn {
          0% { opacity: 0; transform: translateY(24px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(18px, -14px) rotate(6deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 rgba(232, 114, 111, 0.0); }
          50% { box-shadow: 0 0 0 18px rgba(232, 114, 111, 0.08); }
        }
        @keyframes shine {
          0% { transform: translateX(-140%) skewX(-18deg); }
          100% { transform: translateX(240%) skewX(-18deg); }
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          inset: "auto auto 10% 6%",
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          background: "rgba(232, 114, 111, 0.14)",
          filter: "blur(2px)",
          animation: "drift 8s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "12% 8% auto auto",
          width: "180px",
          height: "180px",
          borderRadius: "38% 62% 60% 40% / 46% 38% 62% 54%",
          background: "rgba(107, 165, 131, 0.14)",
          filter: "blur(3px)",
          animation: "drift 10s ease-in-out infinite reverse",
        }}
      />

      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          minHeight: "calc(100vh - 64px)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.05fr) minmax(360px, 0.95fr)",
          gap: "28px",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <section
          style={{
            padding: "24px 12px",
            animation: "floatIn 0.7s ease-out",
          }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "#E8726F",
                border: "3px solid #3A3A3A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "4px 4px 0px rgba(0,0,0,0.12)",
                fontSize: "28px",
              }}
            >
              🎯
            </div>
            <div>
              <p style={{ color: "#6B6354", fontSize: "13px", fontWeight: "bold", letterSpacing: "1.5px" }}>MUNAFA</p>
              <h1 style={{ fontSize: "48px", lineHeight: 1, marginTop: "4px" }}>{isRegister ? "Create account" : "Welcome back"}</h1>
            </div>
          </div>

          <p style={{ fontSize: "18px", lineHeight: 1.6, maxWidth: "620px", color: "#4E483E", marginBottom: "24px" }}>
            Track trades, expenses, and profit cleanly in one place. Sign in to continue or create a new account in a style that matches the rest of the app.
          </p>

          <div
            style={{
              display: "inline-flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {[
              "Protected routes",
              "Safe token storage",
              "Password hashing",
              "Dashboard access",
            ].map((badge) => (
              <span
                key={badge}
                style={{
                  padding: "10px 14px",
                  background: "#F5F3ED",
                  border: "2px solid #3A3A3A",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  boxShadow: "2px 2px 0px rgba(0,0,0,0.08)",
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </section>

        <section style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "100%",
              maxWidth: "460px",
              position: "relative",
              animation: "floatIn 0.85s ease-out",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "-10px -10px auto auto",
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                background: "rgba(232, 114, 111, 0.12)",
                animation: "pulseGlow 4s ease-in-out infinite",
                filter: "blur(1px)",
              }}
            />

            <div
              style={{
                position: "relative",
                overflow: "hidden",
                background: "#F5F3ED",
                border: "3px solid #3A3A3A",
                borderRadius: "18px 22px 16px 24px",
                boxShadow: "12px 12px 0px rgba(0,0,0,0.15)",
                padding: "28px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  overflow: "hidden",
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "42%",
                    height: "100%",
                    background:
                      "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 100%)",
                    transform: "skewX(-18deg)",
                    animation: "shine 4.8s linear infinite",
                  }}
                />
              </div>

              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "20px" }}>
                  <div>
                    <h2 style={{ fontSize: "32px", marginBottom: "6px" }}>{isRegister ? "Sign up" : "Sign in"}</h2>
                    <p style={{ color: "#666", fontSize: "14px" }}>
                      {isRegister ? "Create your account and start tracking." : "Use your account to continue."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleModeToggle}
                    style={{
                      border: "2px solid #3A3A3A",
                      background: isRegister ? "#6BA583" : "#E8726F",
                      color: "#FAF8F3",
                      padding: "10px 14px",
                      borderRadius: "999px",
                      cursor: "pointer",
                      fontFamily: "'Comic Neue', cursive",
                      fontWeight: "bold",
                      boxShadow: "3px 3px 0px rgba(0,0,0,0.12)",
                    }}
                  >
                    {isRegister ? "Use Login" : "Create Account"}
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  {isRegister && (
                    <div style={{ marginBottom: "18px" }}>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>Name</label>
                      <input
                        autoComplete="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        required
                        style={{
                          width: "100%",
                          padding: "12px 14px",
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
                  )}

                  <div style={{ marginBottom: "18px" }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>Email</label>
                    <input
                      autoComplete="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      style={{
                        width: "100%",
                        padding: "12px 14px",
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

                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>Password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        autoComplete={isRegister ? "new-password" : "current-password"}
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={isRegister ? "Create a password" : "Your password"}
                        required
                        style={{
                          width: "100%",
                          padding: "12px 46px 12px 14px",
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
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          fontSize: "14px",
                          color: "#6B6354",
                          fontFamily: "'Comic Neue', cursive",
                          fontWeight: "bold",
                        }}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: "18px", color: "#666", fontSize: "13px", lineHeight: 1.5 }}>
                    {isRegister ? "Use at least 6 characters. Keep it simple, but not too simple." : "Use the email and password from your account."}
                  </div>

                  {error && (
                    <div
                      style={{
                        marginBottom: "18px",
                        padding: "12px 14px",
                        border: "2px solid #D97560",
                        background: "rgba(217, 117, 96, 0.1)",
                        borderRadius: "10px",
                        color: "#D97560",
                        fontWeight: "bold",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: "10px",
                      border: "3px solid #3A3A3A",
                      background: loading ? "#BFB7AB" : "#E8726F",
                      color: "#FAF8F3",
                      fontFamily: "'Comic Neue', cursive",
                      fontWeight: "bold",
                      fontSize: "16px",
                      cursor: loading ? "not-allowed" : "pointer",
                      boxShadow: "4px 4px 0px rgba(0,0,0,0.12)",
                      transition: "all 0.3s ease",
                      marginBottom: "14px",
                    }}
                    onMouseOver={(e) => {
                      if (!loading) {
                        e.target.style.transform = "translateY(-3px)";
                        e.target.style.boxShadow = "6px 6px 0px rgba(0,0,0,0.16)";
                      }
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "4px 4px 0px rgba(0,0,0,0.12)";
                    }}
                  >
                    {loading ? "Working..." : isRegister ? "Create Account" : "Login"}
                  </button>

                  <button
                    type="button"
                    onClick={handleModeToggle}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "10px",
                      border: "2px dashed #3A3A3A",
                      background: "#FAF8F3",
                      color: "#3A3A3A",
                      fontFamily: "'Comic Neue', cursive",
                      fontWeight: "bold",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                  >
                    {isRegister ? "Already have an account? Login" : "No account? Create one"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}