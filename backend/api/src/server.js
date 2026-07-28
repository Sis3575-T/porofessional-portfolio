import app from "./app.js";

const PORT = process.env.GATEWAY_PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
