const API_KEY = import.meta.env.VITE_REMOVEBG_API_KEY || "";
const REMOVEBG_URL = "https://api.remove.bg/v1.0/removebg";
const CLIPDROP_URL = "https://clipdrop-api.co/remove-background/v1";

async function removeWithRemoveBg(blob) {
  if (!API_KEY) throw new Error("No API key");
  const formData = new FormData();
  formData.append("image_file", blob);
  formData.append("size", "auto");

  const res = await fetch(REMOVEBG_URL, {
    method: "POST",
    headers: { "X-Api-Key": API_KEY },
    body: formData,
  });

  if (!res.ok) throw new Error(`Remove.bg error: ${res.status}`);
  return await res.blob();
}

async function removeWithCanvas(imageEl) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const w = imageEl.naturalWidth || imageEl.width;
    const h = imageEl.naturalHeight || imageEl.height;
    canvas.width = w;
    canvas.height = h;

    ctx.drawImage(imageEl, 0, 0, w, h);
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      const isBackground =
        (r > 200 && g > 200 && b > 200) ||
        (r < 50 && g < 50 && b < 50) ||
        (Math.abs(r - g) < 15 && Math.abs(g - b) < 15 && brightness > 160);

      if (isBackground) {
        const edgePixel = checkEdge(data, i, w, h);
        if (!edgePixel) {
          data[i + 3] = 0;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

function checkEdge(data, idx, w, h) {
  const x = (idx / 4) % w;
  const y = Math.floor(idx / 4 / w);
  const margin = 3;
  if (x < margin || x >= w - margin || y < margin || y >= h - margin) return true;

  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const ni = ((y + dy) * w + (x + dx)) * 4;
      const nr = data[ni];
      const ng = data[ni + 1];
      const nb = data[ni + 2];
      const nBright = (nr + ng + nb) / 3;
      const isBg =
        (nr > 200 && ng > 200 && nb > 200) ||
        (nr < 50 && ng < 50 && nb < 50) ||
        (Math.abs(nr - ng) < 15 && Math.abs(ng - nb) < 15 && nBright > 160);
      if (!isBg) return true;
    }
  }
  return false;
}

export async function removeBackground(file, onProgress) {
  onProgress?.("Preparing image...", 10);

  const blob = file instanceof Blob ? file : new Blob([file]);

  if (blob.size > 10 * 1024 * 1024) {
    throw new Error("Maximum file size is 10MB");
  }

  const validTypes = ["image/png", "image/jpeg", "image/webp"];
  if (!validTypes.includes(blob.type)) {
    throw new Error("Unsupported image format. Use PNG, JPG, or WEBP.");
  }

  onProgress?.("Removing background...", 30);

  let resultBlob;

  try {
    if (API_KEY) {
      resultBlob = await removeWithRemoveBg(blob);
    } else {
      throw new Error("No API key, using canvas fallback");
    }
  } catch {
    onProgress?.("Processing locally...", 50);
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
    resultBlob = await removeWithCanvas(img);
    URL.revokeObjectURL(url);
  }

  onProgress?.("Finalizing...", 90);

  const resultUrl = URL.createObjectURL(resultBlob);

  onProgress?.("Done!", 100);

  return {
    url: resultUrl,
    blob: resultBlob,
    width: 0,
    height: 0,
  };
}
