"use client";

import { useRef, useState } from "react";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied to clipboard.");
    } catch {
      setStatus("Copy failed. Select the text and copy it manually.");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(""), 4000);
  }

  return (
    <>
      <button type="button" className="btn btn--small" onClick={copy}>
        {label}
      </button>
      <p role="status" className="copy-status">
        {status}
      </p>
    </>
  );
}
