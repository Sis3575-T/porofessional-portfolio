import { useTheme } from "../context/ThemeContext";

export default function Logo() {
  const { dark } = useTheme();

  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{
        width: 52,
        height: 52,
        borderRadius: 14,
        background: dark ? "#20232A" : "#ffffff",
        border: `1px solid ${dark ? "#2D3138" : "#E5E7EB"}`,
        boxShadow: dark
          ? "0 2px 8px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)"
          : "0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "#2563eb",
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontWeight: 700,
            fontSize: 18,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          ST
        </span>
      </div>
    </div>
  );
}
