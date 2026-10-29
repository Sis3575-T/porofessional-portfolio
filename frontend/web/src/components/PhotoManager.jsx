import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, EyeOff, Trash2, RotateCcw, Move, Lock, Unlock,
  FlipHorizontal2, Target, ArrowUp, ArrowDown, ChevronDown, ChevronUp,
} from "lucide-react";
import { useAvatar } from "../context/AvatarContext";
import { useState } from "react";

export default function PhotoManager() {
  const {
    textureUrl, visible, locked, mirrored, position, rotation, scale,
    toggleVisible, toggleLock, toggleMirror, snapToChair, resetPosition,
    deleteAvatar, setPosition, setRotation, setScale,
  } = useAvatar();
  const [open, setOpen] = useState(false);

  if (!textureUrl) return null;

  const moveAxis = (axis, delta) => {
    const pos = [...position];
    pos[axis] += delta;
    setPosition(pos);
  };

  const rotateAxis = (axis, delta) => {
    const rot = [...rotation];
    rot[axis] += delta;
    setRotation(rot);
  };

  const scaleAxis = (axis, delta) => {
    const s = [...scale];
    s[axis] = Math.max(0.2, s[axis] + delta);
    setScale(s);
  };

  const Btn = ({ icon: Icon, label, onClick, active, danger }) => (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`flex items-center justify-center w-9 h-9 rounded-xl text-sm font-medium transition-all cursor-pointer ${
        danger
          ? "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
          : active
          ? "bg-[#78649D] text-white border border-[#78649D] shadow-sm"
          : "bg-white text-[#51416F] hover:text-[#78649D] border border-[#DED7E2] hover:border-[#78649D]/50"
      }`}
    >
      <Icon size={16} />
    </button>
  );

  return (
    <div className="fixed right-6 bottom-40 z-50">
      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-2xl border border-[#DED7E2] bg-white/95 backdrop-blur-xl px-4 py-2.5 text-sm font-semibold text-[#51416F] shadow-soft-sm hover:border-[#78649D]/50 cursor-pointer"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        <Move size={16} className="text-[#78649D]" />
        <span>Controls</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mt-3 rounded-2xl border border-[#DED7E2] bg-white/95 backdrop-blur-xl p-4 shadow-soft-md w-64 text-[#29262D]"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-xs font-bold text-[#78649D] uppercase tracking-wider mb-3">Visibility</p>
            <div className="flex gap-2 mb-4">
              <Btn icon={visible ? Eye : EyeOff} label="Toggle" onClick={toggleVisible} active={visible} />
              <Btn icon={locked ? Lock : Unlock} label="Lock" onClick={toggleLock} active={!locked} />
              <Btn icon={FlipHorizontal2} label="Mirror" onClick={toggleMirror} active={mirrored} />
              <Btn icon={Target} label="Snap to Chair" onClick={snapToChair} />
              <Btn icon={RotateCcw} label="Reset" onClick={resetPosition} />
              <Btn icon={Trash2} label="Delete" onClick={deleteAvatar} danger />
            </div>

            <p className="text-xs font-bold text-[#78649D] uppercase tracking-wider mb-2">Position</p>
            <div className="grid grid-cols-3 gap-1.5 mb-4">
              <div className="text-[10px] text-[#625D66] text-center col-span-3 mb-1 font-semibold">Move Up/Down</div>
              <Btn icon={ArrowUp} label="Up" onClick={() => moveAxis(1, 0.05)} />
              <Btn icon={ArrowDown} label="Down" onClick={() => moveAxis(1, -0.05)} />
              <div />
            </div>

            <p className="text-xs font-bold text-[#78649D] uppercase tracking-wider mb-2">Rotation</p>
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => rotateAxis(1, -0.15)}
                className="flex-1 text-xs py-1.5 rounded-lg bg-[#FAF8F5] text-[#29262D] hover:bg-[#EAE3F3] border border-[#DED7E2] transition font-medium cursor-pointer"
              >
                Left
              </button>
              <button
                type="button"
                onClick={() => rotateAxis(1, 0.15)}
                className="flex-1 text-xs py-1.5 rounded-lg bg-[#FAF8F5] text-[#29262D] hover:bg-[#EAE3F3] border border-[#DED7E2] transition font-medium cursor-pointer"
              >
                Right
              </button>
            </div>

            <p className="text-xs font-bold text-[#78649D] uppercase tracking-wider mb-2">Scale</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { scaleAxis(0, -0.1); scaleAxis(1, -0.1); }}
                className="flex-1 text-xs py-1.5 rounded-lg bg-[#FAF8F5] text-[#29262D] hover:bg-[#EAE3F3] border border-[#DED7E2] transition font-medium cursor-pointer"
              >
                Smaller
              </button>
              <button
                type="button"
                onClick={() => { scaleAxis(0, 0.1); scaleAxis(1, 0.1); }}
                className="flex-1 text-xs py-1.5 rounded-lg bg-[#FAF8F5] text-[#29262D] hover:bg-[#EAE3F3] border border-[#DED7E2] transition font-medium cursor-pointer"
              >
                Larger
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}