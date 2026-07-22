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
        onClick={() => inputRef.current?.click()}
        disabled={processing}
        className="fixed right-6 bottom-24 z-50 flex items-center gap-2.5 rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl px-5 py-3 text-sm font-semibold text-gray-900 shadow-[0_4px_12px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.6)] transition-all hover:shadow-[0_6px_16px_rgba(37,99,235,0.15),0_16px_40px_rgba(0,0,0,0.12)] hover:border-blue-300/60 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        <Upload size={18} className="text-accent-blue" />
        {textureUrl ? "Replace Photo" : "Upload Your Photo"}
      </motion.button>
    </>
  );
}
