import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { Upload, Trash2, Copy, Image } from "lucide-react";

export default function MediaManager() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetch = async () => {
    try {
      const res = await api.get("/media");
      setAssets(res.data.data || []);
    } catch {
      // Media endpoint may not exist yet
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

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
      toast.success("Uploaded successfully");
      setAssets((prev) => [res.data.data, ...prev]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(`http://localhost:5000${url}`);
    toast.success("URL copied");
  };

  if (loading) return <div className="animate-pulse text-slate-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Media Manager</h2>
        <label className="btn-primary text-sm flex items-center gap-2 cursor-pointer">
          <Upload size={16} />
          {uploading ? "Uploading..." : "Upload Image"}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {assets.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
          <Image size={48} className="mx-auto mb-4 text-slate-400" />
          <p className="text-slate-400">No media uploaded yet</p>
          <p className="text-slate-400 text-sm mt-1">Upload images to use across your portfolio</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {assets.map((asset) => (
            <div key={asset.id} className="group bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="h-40 bg-slate-100 flex items-center justify-center relative">
                {asset.url ? (
                  <img src={`http://localhost:5000${asset.url}`} alt={asset.filename} className="w-full h-full object-cover" />
                ) : (
                  <Image size={32} className="text-slate-400" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button onClick={() => copyUrl(asset.url)} className="p-2 bg-slate-200 rounded-lg text-slate-900 hover:bg-slate-600 transition">
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-slate-400 truncate">{asset.filename}</p>
                {asset.size && <p className="text-xs text-slate-400">{(asset.size / 1024).toFixed(1)} KB</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
