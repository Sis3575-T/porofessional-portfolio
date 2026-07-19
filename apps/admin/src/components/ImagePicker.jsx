import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Image as ImageIcon, Check } from "lucide-react";
import api, { API_URL } from "../services/api";

export default function ImagePicker({ open, onSelect, onClose }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchAssets = async () => {
    try {
      const res = await api.get("/media");
      setAssets(res.data.data || []);
    } catch {
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setLoading(true);
      setSelected(null);
      fetchAssets();
    }
  }, [open]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAssets((prev) => [res.data.data, ...prev]);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSelect = (asset) => {
    const url = `${API_URL}${asset.url}`;
    setSelected(asset.id);
    setTimeout(() => {
      onSelect(url);
      onClose();
    }, 200);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white">Select Image</h3>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-lg text-sm font-medium cursor-pointer transition">
                  <Upload size={14} />
                  {uploading ? "Uploading..." : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white transition">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto max-h-[60vh]">
              {loading ? (
                <div className="grid grid-cols-3 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-square bg-slate-800 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : assets.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon size={40} className="mx-auto mb-3 text-slate-600" />
                  <p className="text-slate-500 text-sm">No images uploaded yet</p>
                  <p className="text-slate-600 text-xs mt-1">Upload an image to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {assets.map((asset) => {
                    const isSelected = selected === asset.id;
                    return (
                      <button
                        key={asset.filename || asset.url}
                        type="button"
                        onClick={() => handleSelect(asset)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                          isSelected
                            ? "border-cyan-400 ring-2 ring-cyan-400/30"
                            : "border-slate-700 hover:border-slate-500"
                        }`}
                      >
                        <img
                          src={`${API_URL}${asset.url}`}
                          alt={asset.filename}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                            <Check size={24} className="text-cyan-400" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
