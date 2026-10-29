import { useRef } from "react";
import { Upload } from "lucide-react";
import { motion } from "framer-motion";
import { useAvatar } from "../context/AvatarContext";
import { removeBackground } from "../utils/removeBackground";
import toast from "react-hot-toast";

export default function UploadPhoto() {
  const inputRef = useRef();
  const { textureUrl, processing, setProcessing, setTexture, setError } = useAvatar();

  const handleFile = async (file) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Maximum file size is 10MB");
      return;
    }

    const validTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Unsupported image format. Use PNG, JPG, or WEBP.");
      return;
    }

    try {
      setProcessing("Preparing your avatar...", 10);
      toast.loading("Removing background...", { id: "avatar-upload" });

      const result = await removeBackground(file, (msg, pct) => {
        setProcessing(msg, pct);
      });

      setTexture(result.url, result.blob);
      toast.success("Avatar ready!", { id: "avatar-upload" });
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Upload failed. Try another image.", { id: "avatar-upload" });
    }
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleChange}
      />

      <motion.button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={processing}
        className="fixed right-6 bottom-24 z-50 flex items-center gap-2.5 rounded-2xl border border-[#DED7E2] dark:border-[#403846] bg-white/95 dark:bg-[#27232D]/95 backdrop-blur-xl px-5 py-3 text-sm font-semibold text-[#51416F] dark:text-[#F6F2F8] shadow-soft-sm hover:border-[#78649D]/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        <Upload size={18} className="text-[#78649D] dark:text-[#B9A4DF]" />
        <span>{textureUrl ? "Replace Photo" : "Upload Your Photo"}</span>
      </motion.button>
    </>
  );
}