import * as THREE from "three";

const codeLines = [
  "import React from 'react';",
  "import { useState } from 'react';",
  "import { motion } from 'framer-motion';",
  "",
  "const App = () => {",
  "  const [count, setCount] = useState(0);",
  "",
  "  useEffect(() => {",
  "    document.title = `Count: ${count}`;",
  "  }, [count]);",
  "",
  "  return (",
  "    <div className='app'>",
  "      <h1>Hello World</h1>",
  "      <p>Welcome to my portfolio</p>",
  "      <button onClick={() => setCount(",
  "        c => c + 1",
  "      )}>",
  "        Click me {count}",
  "      </button>",
  "      <Footer />",
  "    </div>",
  "  );",
  "};",
  "",
  "export default App;",
  "",
  "function Hero() {",
  "  return (",
  "    <section>",
  "      <h2>Projects</h2>",
  "      <div className='grid'>",
  "        {items.map(item => (",
  "          <Card key={item.id} />",
  "        ))}",
  "      </div>",
  "    </section>",
  "  );",
  "}",
  "",
  "const styles = {",
  "  container: {",
  "    display: 'flex',",
  "    padding: '20px',",
  "    background: '#111',",
  "  },",
  "};",
];

const syntaxColors = {
  keyword: "#C678DD",
  string: "#98C379",
  comment: "#5C6370",
  function: "#61AFEF",
  variable: "#E06C75",
  operator: "#56B6C2",
  number: "#D19A66",
  text: "#ABB2BF",
  punctuation: "#ABB2BF",
  tag: "#E06C75",
  prop: "#D19A66",
};

function colorizeWord(word) {
  if (/^(import|from|const|let|var|return|export|default|function|if|else|for|while|switch|case|break|new|class|extends|try|catch|finally|throw|async|await|yield|typeof|instanceof|in|of|true|false|null|undefined|this)$/.test(word)) {
    return syntaxColors.keyword;
  }
  if (/^['"`]/.test(word)) return syntaxColors.string;
  if (/^\d+$/.test(word)) return syntaxColors.number;
  if (/^[A-Z]/.test(word)) return syntaxColors.function;
  if (/^[a-z]+[A-Z]/.test(word)) return syntaxColors.function;
  return syntaxColors.text;
}

function tokenize(line) {
  const tokens = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === " ") {
      let spaces = "";
      while (i < line.length && line[i] === " ") { spaces += " "; i++; }
      tokens.push({ text: spaces, color: syntaxColors.text });
    } else if (line[i] === "/" && line[i + 1] === "/") {
      tokens.push({ text: line.slice(i), color: syntaxColors.comment });
      break;
    } else if (line[i] === "'" || line[i] === '"' || line[i] === "`") {
      const q = line[i];
      let str = q;
      i++;
      while (i < line.length && line[i] !== q) { str += line[i]; i++; }
      if (i < line.length) { str += line[i]; i++; }
      tokens.push({ text: str, color: syntaxColors.string });
    } else if (/[<>]/.test(line[i])) {
      tokens.push({ text: line[i], color: syntaxColors.tag });
      i++;
    } else if (/[{}()\[\];,.]/.test(line[i])) {
      tokens.push({ text: line[i], color: syntaxColors.punctuation });
      i++;
    } else if (/[=+\-*/<>!&|?:]/.test(line[i])) {
      tokens.push({ text: line[i], color: syntaxColors.operator });
      i++;
    } else {
      let word = "";
      while (i < line.length && !/[\s'`"=+\-*/<>!&|?:{}()\[\];,.]/.test(line[i])) { word += line[i]; i++; }
      tokens.push({ text: word, color: colorizeWord(word) });
    }
  }
  return tokens;
}

export function createCodeTexture(width = 512, height = 320) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#1e1e2e";
  ctx.fillRect(0, 0, width, height);

  // Title bar
  ctx.fillStyle = "#181825";
  ctx.fillRect(0, 0, width, 28);

  // Traffic lights
  const dotY = 14;
  const dotR = 5;
  ctx.fillStyle = "#f38ba8";
  ctx.beginPath(); ctx.arc(18, dotY, dotR, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#f9e2af";
  ctx.beginPath(); ctx.arc(36, dotY, dotR, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#a6e3a1";
  ctx.beginPath(); ctx.arc(54, dotY, dotR, 0, Math.PI * 2); ctx.fill();

  // File name
  ctx.fillStyle = "#6c7086";
  ctx.font = "11px monospace";
  ctx.fillText("App.jsx", 72, 18);

  // Line numbers and code
  const lineHeight = 18;
  const startY = 38;
  const lineNumX = 12;
  const codeX = 38;

  ctx.font = "12px monospace";

  codeLines.forEach((line, i) => {
    const y = startY + i * lineHeight;
    if (y > height - 10) return;

    // Line number
    ctx.fillStyle = "#45475a";
    ctx.fillText(String(i + 1).padStart(2, " "), lineNumX, y);

    // Code with syntax highlighting
    const tokens = tokenize(line);
    let x = codeX;
    tokens.forEach((token) => {
      ctx.fillStyle = token.color;
      ctx.fillText(token.text, x, y);
      x += ctx.measureText(token.text).width;
    });
  });

  // Cursor blink line
  ctx.fillStyle = "#cba6f7";
  ctx.fillRect(codeX, startY + 4 * lineHeight, 2, 14);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
