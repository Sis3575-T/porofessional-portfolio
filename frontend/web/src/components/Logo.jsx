import { useTheme } from "../context/ThemeContext";
import { useProfile } from "../context/ProfileContext";
import { usePortfolio } from "../context/PortfolioContext";
import { resolveUrl } from "../utils/resolveUrl";

export default function Logo({ size = 38 }) {
  const { dark } = useTheme();
  const { initials } = useProfile();
  const { settings } = usePortfolio();
  const innerSize = Math.round(size * 0.74);
  const fontSize = Math.round(size * 0.38);
  const borderRadius = Math.round(size * 0.32);

  const logoUrl = dark ? (settings?.logo_dark || settings?.logo) : settings?.logo;

  if (logoUrl) {
    return (
      <img
        src={resolveUrl(logoUrl)}
        alt="Logo"
        className="shrink-0 object-contain transition-transform duration-200 group-hover:scale-105"
        style={{
          width: size,
          height: size,
          borderRadius: borderRadius,
        }}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
      style={{
        width: size,
        height: size,
        borderRadius: borderRadius,
        background: dark ? "#161F30" : "#FFFFFF",
        border: `1px solid ${dark ? "#1E293B" : "#D8E5F8"}`,
        boxShadow: dark
          ? "0 2px 6px rgba(0,0,0,0.3)"
          : "0 2px 6px rgba(20, 33, 61, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
      }}
    >
      <div
        className="flex items-center justify-center transition-colors duration-200"
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: Math.round(borderRadius * 0.65),
          background: dark ? "#3B82F6" : "#246BFD",
        }}
      >
        <span
          style={{
            color: "#FFFFFF",
            fontWeight: 800,
            fontSize,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            fontFamily: '"Plus Jakarta Sans", sans-serif',
          }}
        >
          {initials || "ST"}
        </span>
      </div>
    </div>
  );
}
