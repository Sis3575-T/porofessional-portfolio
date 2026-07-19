import { motion } from "framer-motion";

export default function Hero3DLoading({ progress }) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 z-10"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-16 h-16 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-6" />
      {progress > 0 && (
        <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-cyan-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      )}
      <p className="text-slate-500 text-sm mt-4">Loading 3D scene...</p>
    </motion.div>
  );
}
