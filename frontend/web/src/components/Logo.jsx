import { useTheme } from "../context/ThemeContext";
import { useProfile } from "../context/ProfileContext";

export default function Logo({ size = 52 }) {
  const { dark } = useTheme();
  const { initials } = useProfile();
  const innerSize = Math.round(size * 0.69);
  const fontSize = Math.round(size * 0.35);
  const borderRadius = Math.round(size * 0.27);

  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: borderRadius,
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
          width: innerSize,
          height: innerSize,
          borderRadius: Math.round(borderRadius * 0.6),
          background: "#2563eb",
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontWeight: 700,
            fontSize,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {initials}
        </span>
      </div>
    </div>
  );
}
