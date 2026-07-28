import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";

let server;
let baseUrl;

function waitForServer(app) {
  return new Promise((resolve) => {
    server = createServer(app);
    server.listen(0, () => {
      const { port } = server.address();
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
}

describe("Auth Service", () => {
  let app;

  before(async () => {
    app = (await import("../app.js")).default;
    await waitForServer(app);
  });

  after(() => {
    server?.close();
  });

  it("GET /health returns ok", async () => {
    const res = await fetch(`${baseUrl}/health`);
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.status, "ok");
    assert.equal(body.service, "auth-service");
  });
});
