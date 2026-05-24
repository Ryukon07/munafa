export default function ThemeToggle({ theme, onToggle, className = "" }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={`theme-toggle ${isDark ? "is-dark" : "is-light"} ${className}`.trim()}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      onClick={onToggle}
    >
      <span className="theme-toggle__label theme-toggle__label--light">Light</span>
      <span className="theme-toggle__rail" aria-hidden="true">
        <span className="theme-toggle__stars theme-toggle__stars--left" />
        <span className="theme-toggle__stars theme-toggle__stars--right" />
        <span className="theme-toggle__knob">
          <span className="theme-toggle__orb theme-toggle__orb--sun" />
          <span className="theme-toggle__orb theme-toggle__orb--moon" />
        </span>
      </span>
      <span className="theme-toggle__label theme-toggle__label--dark">Dark</span>
    </button>
  );
}