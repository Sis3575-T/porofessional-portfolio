import app from "./app.js";

const PORT = process.env.PORTFOLIO_SERVICE_PORT || 5002;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Portfolio service running on http://localhost:${PORT}`);
});
