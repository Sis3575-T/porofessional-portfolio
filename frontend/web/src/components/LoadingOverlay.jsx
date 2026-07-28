import { motion, AnimatePresence } from "framer-motion";
import { useAvatar } from "../context/AvatarContext";

export default function LoadingOverlay() {
  const { processing, progress, progressPercent } = useAvatar();

  return (
    <AnimatePresence>
      {processing && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          <motion.div
            className="relative z-10 flex flex-col items-center gap-6 rounded-3xl border border-gray-200/60 bg-white/90 backdrop-blur-xl px-10 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Spinner */}
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40" cy="40" r="34"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="5"
                />
                <circle
                  cx="40" cy="40" r="34"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - progressPercent / 100)}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">{Math.round(progressPercent)}%</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-base font-semibold text-gray-900 mb-1">Preparing Your Avatar</p>
              <p className="text-sm text-gray-500">{progress}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
