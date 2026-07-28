import app from "./app.js";

const PORT = process.env.MEDIA_SERVICE_PORT || 5003;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Media service running on http://localhost:${PORT}`);
});
