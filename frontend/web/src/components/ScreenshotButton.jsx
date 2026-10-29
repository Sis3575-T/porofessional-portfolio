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
      type="button"
      onClick={takeScreenshot}
      className="fixed right-6 bottom-56 z-50 flex items-center gap-2 rounded-2xl border border-[#DED7E2] dark:border-[#403846] bg-white/95 dark:bg-[#27232D]/95 backdrop-blur-xl px-4 py-2.5 text-sm font-semibold text-[#51416F] dark:text-[#F6F2F8] shadow-soft-sm cursor-pointer"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      <Camera size={16} className="text-[#78649D] dark:text-[#B9A4DF]" />
      <span>Screenshot</span>
    </motion.button>
  );
}