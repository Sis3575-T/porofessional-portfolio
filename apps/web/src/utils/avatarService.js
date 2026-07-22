const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const RPM_BASE = "https://api.readyplayer.me/v1";

export async function generateAvatarFromPhoto(file, options = {}) {
  const { gender = "male", style = "casual" } = options;

  const formData = new FormData();
  formData.append("photo", file);
  formData.append("gender", gender);
  formData.append("style", style);

  try {
    const res = await fetch(`${API_URL}/api/v1/avatar/generate`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Avatar generation failed");
    }

    return await res.json();
  } catch (err) {
    console.error("Avatar generation error:", err);
    throw err;
  }
}

export async function generateWithReadyPlayerMe(imageBlob) {
  const RPM_API_KEY = import.meta.env.VITE_RPM_API_KEY;
  if (!RPM_API_KEY) throw new Error("Ready Player Me API key not configured");

  const uploadForm = new FormData();
  uploadForm.append("image", imageBlob);

  const uploadRes = await fetch(`${RPM_BASE}/avatars`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${RPM_API_KEY}` },
    body: uploadForm,
  });

  if (!uploadRes.ok) throw new Error("Failed to upload photo to Ready Player Me");
  const { data } = await uploadRes.json();
  const avatarId = data.id;

  const modelRes = await fetch(
    `${RPM_BASE}/avatars/${avatarId}/model.glb?morphTargets=ARKit&textureSize=1024`,
    { headers: { "Authorization": `Bearer ${RPM_API_KEY}` } }
  );

  if (!modelRes.ok) throw new Error("Failed to generate 3D model");
  const blob = await modelRes.blob();
  const url = URL.createObjectURL(blob);

  return { avatarId, modelUrl: url, blob };
}

export async function fetchSavedAvatar() {
  try {
    const res = await fetch(`${API_URL}/api/v1/avatar`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}

export async function saveAvatar(avatarData) {
  const res = await fetch(`${API_URL}/api/v1/avatar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(avatarData),
  });
  if (!res.ok) throw new Error("Failed to save avatar");
  return await res.json();
}

export async function deleteAvatar() {
  const res = await fetch(`${API_URL}/api/v1/avatar`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete avatar");
  return await res.json();
}
