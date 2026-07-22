import { useCallback } from "react";
import { Camera } from "lucide-react";
import { motion } from "framer-motion";
import { useAvatar } from "../context/AvatarContext";
import toast from "react-hot-toast";

export default function ScreenshotButton({ canvasRef }) {
  const { textureUrl } = useAvatar();

  const takeScreenshot = useCallback(() => {
    const canvas = canvasRef?.current?.querySelector?.("canvas")
      || document.querySelector("canvas");

    if (!canvas) {
      toast.error("Canvas not found");
      return;
    }

    try {
      const link = document.createElement("a");
      link.download = `portfolio-room-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
      toast.success("Screenshot saved!");
    } catch {
      toast.error("Failed to take screenshot");
    }
  }, [canvasRef]);

  if (!textureUrl) return null;

  return (
    <motion.button
      onClick={takeScreenshot}
      className="fixed right-6 bottom-56 z-50 flex items-center gap-2 rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-[0_4px_12px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.1)]"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      <Camera size={16} className="text-accent-blue" />
      Screenshot
    </motion.button>
  );
}
