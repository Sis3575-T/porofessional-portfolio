import { useState, useRef } from "react";
import { Upload, Trash2, User, Loader2, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { generateAvatarFromPhoto, saveAvatar, deleteAvatar as deleteAvatarAPI } from "../../services/api";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AvatarEditor() {
  const [avatar, setAvatar] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Maximum file size is 10MB");
      return;
    }

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleGenerate = async () => {
    if (!photo) {
      toast.error("Please select a photo first");
      return;
    }

    setGenerating(true);
    setProgress("Uploading photo...");
    setProgressPercent(10);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("photo", photo);

      setProgress("AI is analyzing your face...");
      setProgressPercent(30);

      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/v1/avatar/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      setProgress("Generating 3D model...");
      setProgressPercent(60);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Avatar generation failed");
      }

      const data = await res.json();

      setProgress("Applying textures...");
      setProgressPercent(80);

      setProgress("Finalizing avatar...");
      setProgressPercent(95);

      await saveAvatar({
        avatarId: data.data.avatarId,
        modelUrl: data.data.modelUrl,
        photoUrl: data.data.photoUrl || photoPreview,
      });

      setAvatar(data.data);
      setProgressPercent(100);
      setProgress("Done!");
      toast.success("3D avatar generated successfully!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAvatarAPI();
      setAvatar(null);
      setPhoto(null);
      setPhotoPreview(null);
      toast.success("Avatar deleted");
    } catch {
      toast.error("Failed to delete avatar");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">3D Avatar Generator</h1>
        <p className="text-slate-500 text-sm">
          Upload your photo and AI will generate a realistic 3D avatar that sits in your portfolio room.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Upload Photo</h2>

          <div
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              photoPreview
                ? "border-green-300 bg-green-50/50"
                : "border-slate-300 hover:border-blue-400 hover:bg-blue-50/30"
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleFileSelect}
            />

            {photoPreview ? (
              <div className="space-y-3">
                <img
                  src={photoPreview}
                  alt="Upload preview"
                  className="w-40 h-40 object-cover rounded-xl mx-auto border border-slate-200"
                />
                <p className="text-sm text-green-600 font-medium">Photo selected</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhoto(null);
                    setPhotoPreview(null);
                  }}
                  className="text-sm text-slate-500 hover:text-red-500 transition"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
                  <Upload size={24} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Click to upload</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP (max 10MB)</p>
                </div>
              </div>
            )}
          </div>

          {generating && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Loader2 size={16} className="animate-spin text-blue-500" />
                {progress}
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={!photo || generating}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {generating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <User size={16} />
                  Generate 3D Avatar
                </>
              )}
            </button>

            {avatar && (
              <button
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 text-sm font-semibold rounded-xl border border-red-200 hover:bg-red-100 transition"
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Avatar Preview</h2>

          {avatar ? (
            <div className="space-y-4">
              <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                <img
                  src={avatar.modelUrl}
                  alt="Generated avatar"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="hidden items-center justify-center flex-col gap-2 text-slate-500">
                  <CheckCircle size={48} className="text-green-500" />
                  <p className="text-sm font-medium">Avatar generated successfully!</p>
                  <p className="text-xs text-slate-400">View it in your portfolio room</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
                <CheckCircle size={16} className="text-green-500" />
                <p className="text-sm text-green-700">
                  Your 3D avatar is now visible in the portfolio room!
                </p>
              </div>
            </div>
          ) : (
            <div className="aspect-square bg-slate-50 rounded-xl flex items-center justify-center border border-dashed border-slate-200">
              <div className="text-center space-y-2">
                <User size={48} className="text-slate-300 mx-auto" />
                <p className="text-sm text-slate-400">
                  Upload a photo to generate your 3D avatar
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">How it works</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: "1", title: "Upload Photo", desc: "Select a clear front-facing photo" },
            { step: "2", title: "AI Analysis", desc: "AI analyzes your face and features" },
            { step: "3", title: "3D Generation", desc: "Realistic 3D model is created" },
            { step: "4", title: "Auto Placement", desc: "Avatar sits in your room automatically" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                {item.step}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
