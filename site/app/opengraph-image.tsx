import { ImageResponse } from "next/og";
import { getPortfolio } from "@/lib/data";

export const alt = "Portfolio preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const { profile } = await getPortfolio();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          color: "#000000",
          padding: 80,
          border: "16px solid #000000",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 4, textTransform: "uppercase", color: "#555555" }}>
          {profile?.role ?? "Portfolio"}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.05 }}>{profile?.name ?? "Portfolio"}</div>
          {profile?.headline ? (
            <div style={{ fontSize: 36, marginTop: 24, color: "#333333", maxWidth: 960 }}>{profile.headline}</div>
          ) : null}
        </div>
      </div>
    ),
    size,
  );
}
