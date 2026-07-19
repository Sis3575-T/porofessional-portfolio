import app from "./app.js";

const PORT = process.env.DASHBOARD_SERVICE_PORT || 5004;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Dashboard service running on http://localhost:${PORT}`);
});
