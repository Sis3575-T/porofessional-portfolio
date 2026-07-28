import app from "./app.js";

const PORT = process.env.AUTH_SERVICE_PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Auth service running on http://localhost:${PORT}`);
});
