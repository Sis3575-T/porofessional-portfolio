import * as THREE from "three";

/**
 * High-resolution canvas texture generators for the 3D developer workspace.
 * Generated procedurally on HTML5 Canvas: zero network load, instant startup, razor-sharp typography.
 */

function setupCanvas(w, h) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  return { canvas, ctx };
}

function toTexture(canvas) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

/**
 * 1. VS Code IDE Editor Texture for Main Monitor
 */
export function createMainCodeTexture(w = 1024, h = 640) {
  const { canvas, ctx } = setupCanvas(w, h);

  // Background - Deep VS Code Dark
  ctx.fillStyle = "#181A1F";
  ctx.fillRect(0, 0, w, h);

  // Top Bar / Title Bar
  ctx.fillStyle = "#1E2227";
  ctx.fillRect(0, 0, w, 44);

  // Window control dots
  const dotY = 22;
  ctx.fillStyle = "#EF4444";
  ctx.beginPath(); ctx.arc(26, dotY, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#F59E0B";
  ctx.beginPath(); ctx.arc(48, dotY, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#10B981";
  ctx.beginPath(); ctx.arc(70, dotY, 7, 0, Math.PI * 2); ctx.fill();

  // Active Tab
  ctx.fillStyle = "#282C34";
  ctx.fillRect(100, 6, 210, 38);
  ctx.fillStyle = "#61DAFB";
  ctx.beginPath(); ctx.arc(120, 25, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 15px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("DeveloperWorkspace.jsx", 134, 31);

  // Second Tab
  ctx.fillStyle = "#1E2227";
  ctx.fillRect(316, 6, 160, 38);
  ctx.fillStyle = "#94A3B8";
  ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("portfolio.config.ts", 332, 31);

  // Left Activity Bar
  ctx.fillStyle = "#1E2227";
  ctx.fillRect(0, 44, 52, h - 76);

  ctx.strokeStyle = "#61DAFB";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(16, 60, 20, 18);
  ctx.strokeStyle = "#828997";
  ctx.beginPath();
  ctx.arc(26, 110, 8, 0, Math.PI * 2);
  ctx.stroke();

  // File Tree Sidebar
  ctx.fillStyle = "#21252B";
  ctx.fillRect(52, 44, 160, h - 76);
  ctx.fillStyle = "#CBD5E1";
  ctx.font = "bold 12px sans-serif";
  ctx.fillText("EXPLORER", 64, 70);

  const files = [
    { name: "▾ src", color: "#FCD34D", bold: true, indent: 0 },
    { name: "  ▾ components", color: "#FCD34D", bold: true, indent: 6 },
    { name: "    ▸ 3d-workspace", color: "#86EFAC", indent: 12 },
    { name: "    ⚛ Workspace.jsx", color: "#67E8F9", indent: 12 },
    { name: "    ⚙ Skills.tsx", color: "#93C5FD", indent: 12 },
    { name: "  ▸ database", color: "#94A3B8", indent: 6 },
    { name: "  ★ AI_Engine.py", color: "#FCA5A5", indent: 6 },
  ];
  let fileY = 96;
  files.forEach((f) => {
    ctx.fillStyle = f.color;
    ctx.font = `${f.bold ? "bold " : ""}12px 'Fira Code', monospace`;
    ctx.fillText(f.name, 62 + (f.indent || 0), fileY);
    fileY += 24;
  });

  // Editor Area
  const editorX = 222;
  const editorY = 56;

  const codeLines = [
    { num: 1, tokens: [{ t: "import", c: "#C678DD" }, { t: " React, { useState } ", c: "#E06C75" }, { t: "from", c: "#C678DD" }, { t: " 'react';", c: "#98C379" }] },
    { num: 2, tokens: [{ t: "import", c: "#C678DD" }, { t: " { Canvas } ", c: "#E06C75" }, { t: "from", c: "#C678DD" }, { t: " '@react-three/fiber';", c: "#98C379" }] },
    { num: 3, tokens: [{ t: "import", c: "#C678DD" }, { t: " { OrbitControls } ", c: "#E06C75" }, { t: "from", c: "#C678DD" }, { t: " '@react-three/drei';", c: "#98C379" }] },
    { num: 4, tokens: [] },
    { num: 5, tokens: [{ t: "// Sisay Temesgen — Full Stack Developer & AI Learner", c: "#5C6370" }] },
    { num: 6, tokens: [{ t: "export const", c: "#C678DD" }, { t: " SisayPortfolio", c: "#61AFEF" }, { t: " = () => {", c: "#ABB2BF" }] },
    { num: 7, tokens: [{ t: "  const", c: "#C678DD" }, { t: " [stack] = ", c: "#ABB2BF" }, { t: "useState", c: "#61AFEF" }, { t: "([", c: "#ABB2BF" }] },
    { num: 8, tokens: [{ t: "    'React', 'Node.js', 'PostgreSQL', 'Python', 'AI'", c: "#98C379" }] },
    { num: 9, tokens: [{ t: "  ]);", c: "#ABB2BF" }] },
    { num: 10, tokens: [] },
    { num: 11, tokens: [{ t: "  const", c: "#C678DD" }, { t: " education", c: "#E06C75" }, { t: " = {", c: "#ABB2BF" }] },
    { num: 12, tokens: [{ t: "    university: ", c: "#ABB2BF" }, { t: "'Bahir Dar University'", c: "#98C379" }, { t: ",", c: "#ABB2BF" }] },
    { num: 13, tokens: [{ t: "    degree: ", c: "#ABB2BF" }, { t: "'BSc Computer Science - 4th Year'", c: "#98C379" }, { t: ",", c: "#ABB2BF" }] },
    { num: 14, tokens: [{ t: "    focus: ", c: "#ABB2BF" }, { t: "'Full Stack Web & Artificial Intelligence'", c: "#98C379" }] },
    { num: 15, tokens: [{ t: "  };", c: "#ABB2BF" }] },
    { num: 16, tokens: [] },
    { num: 17, tokens: [{ t: "  return (", c: "#C678DD" }] },
    { num: 18, tokens: [{ t: "    <", c: "#E06C75" }, { t: "InteractiveWorkspace", c: "#E5C07B" }, { t: " rotatable360={", c: "#D19A66" }, { t: "true", c: "#56B6C2" }, { t: "}>", c: "#E06C75" }] },
    { num: 19, tokens: [{ t: "      <", c: "#E06C75" }, { t: "SisayVision", c: "#E5C07B" }, { t: " mission=", c: "#D19A66" }, { t: "'Building Impactful Software'", c: "#98C379" }, { t: " />", c: "#E06C75" }] },
    { num: 20, tokens: [{ t: "      <", c: "#E06C75" }, { t: "ThreeScene", c: "#E5C07B" }, { t: " stack={stack} transparent={", c: "#D19A66" }, { t: "true", c: "#56B6C2" }, { t: "}", c: "#ABB2BF" }, { t: " />", c: "#E06C75" }] },
    { num: 21, tokens: [{ t: "    </", c: "#E06C75" }, { t: "InteractiveWorkspace", c: "#E5C07B" }, { t: ">", c: "#E06C75" }] },
    { num: 22, tokens: [{ t: "  );", c: "#C678DD" }] },
    { num: 23, tokens: [{ t: "};", c: "#ABB2BF" }] },
    { num: 24, tokens: [{ t: "export default", c: "#C678DD" }, { t: " SisayPortfolio;", c: "#61AFEF" }] },
  ];

  let lineY = editorY + 22;
  codeLines.forEach((line) => {
    ctx.fillStyle = "#5C6370";
    ctx.font = "bold 13px 'Fira Code', monospace";
    ctx.textAlign = "right";
    ctx.fillText(String(line.num), editorX + 28, lineY);

    let tokenX = editorX + 48;
    ctx.textAlign = "left";
    line.tokens.forEach((t) => {
      ctx.fillStyle = t.c;
      ctx.font = "13px 'Fira Code', monospace";
      ctx.fillText(t.t, tokenX, lineY);
      tokenX += ctx.measureText(t.t).width;
    });

    lineY += 21;
  });

  // Bottom Status Bar
  ctx.fillStyle = "#246BFD";
  ctx.fillRect(0, h - 32, w, 32);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("  ⚡ main*  ·  UTF-8  ·  TypeScript JSX  ·  Prettier: Active  ·  Sisay Temesgen Portfolio", 14, h - 11);

  return toTexture(canvas);
}

/**
 * 2. Laptop Terminal Texture
 */
export function createLaptopScreenTexture(w = 640, h = 400) {
  const { canvas, ctx } = setupCanvas(w, h);

  ctx.fillStyle = "#0A0E17";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#141C2E";
  ctx.fillRect(0, 0, w, 34);

  ctx.fillStyle = "#EF4444";
  ctx.beginPath(); ctx.arc(20, 17, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#F59E0B";
  ctx.beginPath(); ctx.arc(38, 17, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#10B981";
  ctx.beginPath(); ctx.arc(56, 17, 5, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = "#E2E8F0";
  ctx.font = "bold 13px monospace";
  ctx.fillText("sisay@macbook-pro: ~/portfolio", 76, 22);

  const logs = [
    { t: "sisay@portfolio:~$ npm run dev", c: "#38BDF8" },
    { t: "> vite --host 0.0.0.0", c: "#64748B" },
    { t: "✓ VITE v5.4.10 ready in 142 ms", c: "#10B981" },
    { t: "➜ Local:    http://localhost:5173/", c: "#F8FAFC" },
    { t: "➜ Network:  https://sisay-temesgen.vercel.app/", c: "#38BDF8" },
    { t: "➜ 3D Scene: WebGL Transparent Canvas Ready", c: "#A855F7" },
    { t: "➜ Database: PostgreSQL Connected via Neon", c: "#34D399" },
    { t: "➜ AI Core:  Models Loaded & Listening", c: "#FBBF24" },
    { t: "[Hot Reload] Active - Watching workspace files...", c: "#64748B" },
    { t: "sisay@portfolio:~$ █", c: "#38BDF8" },
  ];

  let logY = 66;
  ctx.font = "14px 'Fira Code', monospace";
  logs.forEach((log) => {
    ctx.fillStyle = log.c;
    ctx.fillText(log.t, 24, logY);
    logY += 27;
  });

  return toTexture(canvas);
}

/**
 * 3. Book Spine Texture (Double-sided, high contrast)
 */
export function createBookSpineTexture(title, tagColor = "#246BFD", w = 512, h = 90) {
  const { canvas, ctx } = setupCanvas(w, h);

  ctx.fillStyle = "#0F172A";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = tagColor;
  ctx.fillRect(16, 12, 10, h - 24);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 32px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(title, 42, 50);

  ctx.fillStyle = "#CBD5E1";
  ctx.font = "bold 18px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("Sisay Temesgen · Modern Tech", 42, 74);

  return toTexture(canvas);
}

/**
 * 4. Professional Identity Panel Texture (Top Center)
 * High contrast, bold typography, perfectly legible.
 */
export function createIdentityPanelTexture(w = 800, h = 260) {
  const { canvas, ctx } = setupCanvas(w, h);

  // Clean white card background with crisp border
  ctx.fillStyle = "#FFFFFF";
  roundRect(ctx, 12, 12, w - 24, h - 24, 26);
  ctx.fill();

  ctx.strokeStyle = "#CBD5E1";
  ctx.lineWidth = 4;
  roundRect(ctx, 12, 12, w - 24, h - 24, 26);
  ctx.stroke();

  // Name: Sisay Temesgen
  ctx.textAlign = "center";
  ctx.fillStyle = "#0F172A";
  ctx.font = "900 52px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("Sisay Temesgen", w / 2, 92);

  // Blue Accent underline
  const gradient = ctx.createLinearGradient(w / 2 - 90, 0, w / 2 + 90, 0);
  gradient.addColorStop(0, "#246BFD");
  gradient.addColorStop(1, "#38BDF8");
  ctx.fillStyle = gradient;
  roundRect(ctx, w / 2 - 75, 114, 150, 7, 3);
  ctx.fill();

  // Subtitle: Full Stack Developer & AI Learner
  ctx.fillStyle = "#1E293B";
  ctx.font = "bold 30px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("Full Stack Developer & AI Learner", w / 2, 175);

  return toTexture(canvas);
}

/**
 * 5. Education Panel Texture (Left)
 * Clear, bold, high-contrast typography.
 */
export function createEducationPanelTexture(w = 640, h = 440) {
  const { canvas, ctx } = setupCanvas(w, h);

  ctx.fillStyle = "#FFFFFF";
  roundRect(ctx, 12, 12, w - 24, h - 24, 24);
  ctx.fill();

  ctx.strokeStyle = "#CBD5E1";
  ctx.lineWidth = 3.5;
  roundRect(ctx, 12, 12, w - 24, h - 24, 24);
  ctx.stroke();

  // Graduation Cap Badge Icon
  const iconX = 66;
  const iconY = 66;
  ctx.fillStyle = "#E0EDFF";
  ctx.beginPath();
  ctx.arc(iconX, iconY, 34, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#246BFD";
  ctx.beginPath();
  ctx.moveTo(iconX, iconY - 16);
  ctx.lineTo(iconX + 22, iconY - 5);
  ctx.lineTo(iconX, iconY + 6);
  ctx.lineTo(iconX - 22, iconY - 5);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(iconX - 12, iconY + 5, 24, 9);

  // Section Header: Education
  ctx.fillStyle = "#0F172A";
  ctx.font = "900 36px 'Plus Jakarta Sans', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Education", 120, 78);

  // University Name
  ctx.fillStyle = "#0F172A";
  ctx.font = "900 34px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("Bahir Dar University", 48, 168);

  // Degree
  ctx.fillStyle = "#246BFD";
  ctx.font = "800 28px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("BSc Computer Science", 48, 222);

  // Year Badge Pill
  ctx.fillStyle = "#F1F5F9";
  roundRect(ctx, 48, 260, 240, 56, 14);
  ctx.fill();
  ctx.strokeStyle = "#CBD5E1";
  ctx.lineWidth = 2;
  roundRect(ctx, 48, 260, 240, 56, 14);
  ctx.stroke();

  ctx.fillStyle = "#0F172A";
  ctx.font = "800 24px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("★ 4th Year Student", 66, 297);

  // Subtitle
  ctx.fillStyle = "#475569";
  ctx.font = "600 22px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("Faculty of Computing", 48, 365);

  return toTexture(canvas);
}

/**
 * 6. Technical Skills Panel Texture (Right)
 * Large bold badges for all 10 technologies.
 */
export function createSkillsPanelTexture(w = 680, h = 500) {
  const { canvas, ctx } = setupCanvas(w, h);

  ctx.fillStyle = "#FFFFFF";
  roundRect(ctx, 12, 12, w - 24, h - 24, 24);
  ctx.fill();

  ctx.strokeStyle = "#CBD5E1";
  ctx.lineWidth = 3.5;
  roundRect(ctx, 12, 12, w - 24, h - 24, 24);
  ctx.stroke();

  // Header
  const iconX = 66;
  const iconY = 66;
  ctx.fillStyle = "#EEF2FF";
  ctx.beginPath();
  ctx.arc(iconX, iconY, 32, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#4F46E5";
  ctx.font = "bold 28px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("⚙", iconX, iconY + 10);

  ctx.fillStyle = "#0F172A";
  ctx.font = "900 36px 'Plus Jakarta Sans', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Skills", 118, 78);

  const skills = [
    { name: "React.js", color: "#0284C7", bg: "#F0FDFA", border: "#67E8F9" },
    { name: "Node.js", color: "#16A34A", bg: "#F0FDF4", border: "#86EFAC" },
    { name: "PostgreSQL", color: "#2563EB", bg: "#EFF6FF", border: "#93C5FD" },
    { name: "Python", color: "#D97706", bg: "#FEFCE8", border: "#FDE047" },
    { name: "Express.js", color: "#0F172A", bg: "#F8FAFC", border: "#CBD5E1" },
    { name: "MongoDB", color: "#059669", bg: "#ECFDF5", border: "#6EE7B7" },
    { name: "JavaScript", color: "#CA8A04", bg: "#FEF9C3", border: "#FACC15" },
    { name: "HTML5/CSS3", color: "#EA580C", bg: "#FFF7ED", border: "#FDBA74" },
    { name: "REST APIs", color: "#4F46E5", bg: "#EEF2FF", border: "#A5B4FC" },
  ];

  const startX = 40;
  const startY = 118;
  const colW = 194;
  const rowH = 108;

  skills.forEach((skill, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = startX + col * colW;
    const y = startY + row * rowH;

    ctx.fillStyle = skill.bg;
    roundRect(ctx, x, y, colW - 14, 88, 16);
    ctx.fill();

    ctx.strokeStyle = skill.border;
    ctx.lineWidth = 2.5;
    roundRect(ctx, x, y, colW - 14, 88, 16);
    ctx.stroke();

    ctx.fillStyle = skill.color;
    ctx.beginPath();
    ctx.arc(x + 28, y + 44, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#0F172A";
    ctx.font = "800 18px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(skill.name, x + 50, y + 51);
  });

  return toTexture(canvas);
}

/**
 * 7. Goals and Ambitions Panel Texture (Lower Right)
 */
export function createGoalsPanelTexture(w = 640, h = 420) {
  const { canvas, ctx } = setupCanvas(w, h);

  ctx.fillStyle = "#FFFFFF";
  roundRect(ctx, 12, 12, w - 24, h - 24, 24);
  ctx.fill();

  ctx.strokeStyle = "#CBD5E1";
  ctx.lineWidth = 3.5;
  roundRect(ctx, 12, 12, w - 24, h - 24, 24);
  ctx.stroke();

  // Target Bullseye Icon
  const iconX = 66;
  const iconY = 66;
  ctx.fillStyle = "#FEF2F2";
  ctx.beginPath();
  ctx.arc(iconX, iconY, 32, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#EF4444";
  ctx.beginPath();
  ctx.arc(iconX, iconY, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(iconX, iconY, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#0F172A";
  ctx.font = "900 36px 'Plus Jakarta Sans', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("My Goals", 118, 78);

  const goals = [
    "Become an AI Engineer",
    "Build Impactful Software",
    "Develop Advanced Apps",
    "Master Emerging Tech",
  ];

  let itemY = 152;
  goals.forEach((goal) => {
    ctx.fillStyle = "#10B981";
    ctx.beginPath();
    ctx.arc(60, itemY - 7, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(53, itemY - 7);
    ctx.lineTo(58, itemY - 2);
    ctx.lineTo(67, itemY - 13);
    ctx.stroke();

    ctx.fillStyle = "#0F172A";
    ctx.font = "800 23px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(goal, 90, itemY);

    itemY += 62;
  });

  return toTexture(canvas);
}

/**
 * 8. Procedural World Globe Texture
 */
export function createGlobeTexture(w = 1024, h = 512) {
  const { canvas, ctx } = setupCanvas(w, h);

  ctx.fillStyle = "#0284C7";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#10B981";

  ctx.beginPath();
  ctx.ellipse(w * 0.52, h * 0.38, w * 0.22, h * 0.26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(w * 0.53, h * 0.62, w * 0.12, h * 0.22, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(w * 0.22, h * 0.34, w * 0.16, h * 0.22, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(w * 0.29, h * 0.68, w * 0.10, h * 0.22, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(w * 0.82, h * 0.72, w * 0.08, h * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.lineWidth = 1.5;
  for (let y = 0; y <= h; y += h / 6) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  for (let x = 0; x <= w; x += w / 8) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  return toTexture(canvas);
}

/**
 * 9. Code Badge `</>`
 */
export function createBackpackCodeBadge(w = 256, h = 256) {
  const { canvas, ctx } = setupCanvas(w, h);

  ctx.fillStyle = "#0F172A";
  roundRect(ctx, 16, 16, w - 32, h - 32, 40);
  ctx.fill();

  ctx.strokeStyle = "#38BDF8";
  ctx.lineWidth = 6;
  roundRect(ctx, 16, 16, w - 32, h - 32, 40);
  ctx.stroke();

  ctx.fillStyle = "#F8FAFC";
  ctx.font = "bold 96px 'Fira Code', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("</>", w / 2, h / 2);

  return toTexture(canvas);
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
