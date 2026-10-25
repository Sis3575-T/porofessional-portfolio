import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getPortfolio, siteUrl } from "@/lib/data";
import "./globals.css";

const sans = Geist({ variable: "--font-sans", subsets: ["latin"], display: "swap" });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"], display: "swap", preload: false });

// Applies a saved manual theme before first paint to avoid a flash.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPortfolio();
  const name = profile?.name ?? "Portfolio";
  const title = profile ? `${profile.name} — ${profile.role}` : "Portfolio";
  const description = profile?.headline || profile?.bio.slice(0, 160) || "Portfolio";
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s · ${name}` },
    description,
    alternates: { canonical: "/" },
    openGraph: { type: "website", url: "/", title, description, siteName: name },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
