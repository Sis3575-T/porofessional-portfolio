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
      onClick={onClick}
      title={label}
      className={`flex items-center justify-center w-9 h-9 rounded-xl text-sm font-medium transition-all ${
        danger
          ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200/60"
          : active
          ? "bg-accent-blue text-white border border-blue-400/60 shadow-md"
          : "bg-white/80 text-gray-600 hover:text-gray-900 border border-gray-200/60 hover:border-gray-300/60"
      }`}
    >
      <Icon size={16} />
    </button>
  );

  return (
    <div className="fixed right-6 bottom-40 z-50">
      <motion.button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-[0_4px_12px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.1)]"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        <Move size={16} className="text-accent-blue" />
        Controls
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mt-3 rounded-2xl border border-gray-200/60 bg-white/90 backdrop-blur-xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)] w-64"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Visibility</p>
            <div className="flex gap-2 mb-4">
              <Btn icon={visible ? Eye : EyeOff} label="Toggle" onClick={toggleVisible} active={visible} />
              <Btn icon={locked ? Lock : Unlock} label="Lock" onClick={toggleLock} active={!locked} />
              <Btn icon={FlipHorizontal2} label="Mirror" onClick={toggleMirror} active={mirrored} />
              <Btn icon={Target} label="Snap to Chair" onClick={snapToChair} />
              <Btn icon={RotateCcw} label="Reset" onClick={resetPosition} />
              <Btn icon={Trash2} label="Delete" onClick={deleteAvatar} danger />
            </div>

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Position</p>
            <div className="grid grid-cols-3 gap-1.5 mb-4">
              <div className="text-[10px] text-gray-400 text-center col-span-3 mb-1">Move</div>
              <Btn icon={ArrowUp} label="Up" onClick={() => moveAxis(1, 0.05)} />
              <Btn icon={ArrowDown} label="Down" onClick={() => moveAxis(1, -0.05)} />
              <div />
            </div>

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Rotation</p>
            <div className="flex gap-2 mb-4">
              <button onClick={() => rotateAxis(1, -0.15)} className="flex-1 text-xs py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition font-medium">Left</button>
              <button onClick={() => rotateAxis(1, 0.15)} className="flex-1 text-xs py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition font-medium">Right</button>
            </div>

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Scale</p>
            <div className="flex gap-2">
              <button onClick={() => { scaleAxis(0, -0.1); scaleAxis(1, -0.1); }} className="flex-1 text-xs py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition font-medium">Smaller</button>
              <button onClick={() => { scaleAxis(0, 0.1); scaleAxis(1, 0.1); }} className="flex-1 text-xs py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition font-medium">Larger</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
