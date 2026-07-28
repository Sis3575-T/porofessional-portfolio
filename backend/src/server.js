import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Cloudinary config: cloud_name=${process.env.CLOUDINARY_CLOUD_NAME ? "SET" : "MISSING"}, api_key=${process.env.CLOUDINARY_API_KEY ? "SET" : "MISSING"}, api_secret=${process.env.CLOUDINARY_API_SECRET ? "SET" : "MISSING"}`);
});
