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
      baseUrl = `http://127.0.0.1:${port}`;
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

  it("POST /api/v1/auth/login requires email and password", async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const body = await res.json();
    assert.equal(res.status, 400);
    assert.equal(body.success, false);
  });

  it("POST /api/v1/auth/login authenticates admin credentials", async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "sisay3575@gmail.com",
        password: "Sis3575@",
      }),
    });
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.success, true);
    assert.ok(body.token, "Must return JWT token");
    assert.equal(body.user.email, "sisay3575@gmail.com");
    assert.equal(body.user.role, "ADMIN");
  });
});
