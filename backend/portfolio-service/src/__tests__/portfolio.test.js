import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { prisma } from "shared/utils/prisma";

let server;
let baseUrl;

function waitForServer(app) {
  return new Promise((resolve) => {
    server = createServer(app);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
}

describe("Portfolio Service", () => {
  let app;

  before(async () => {
    app = (await import("../app.js")).default;
    await waitForServer(app);
  });

  after(async () => {
    server?.close();
    try {
      await prisma.$disconnect();
    } catch {}
  });

  it("GET /health returns ok", async () => {
    const res = await fetch(`${baseUrl}/health`);
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.status, "ok");
    assert.equal(body.service, "portfolio-service");
  });

  it("GET /api/v1/hero returns 200", async () => {
    const res = await fetch(`${baseUrl}/api/v1/hero`);
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.success, true);
  });

  it("GET /api/v1/portfolio returns consolidated payload and cache headers", async () => {
    const res = await fetch(`${baseUrl}/api/v1/portfolio`);
    assert.equal(res.status, 200);
    const etag = res.headers.get("etag");
    const cacheControl = res.headers.get("cache-control");
    assert.ok(etag, "ETag header must be present");
    assert.ok(cacheControl?.includes("public"), "Cache-Control must be public");

    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(typeof body.data === "object");
    assert.ok("hero" in body.data);
    assert.ok("about" in body.data);
    assert.ok("skills" in body.data);
    assert.ok("services" in body.data);
    assert.ok("experiences" in body.data);
    assert.ok("education" in body.data);
    assert.ok("projects" in body.data);
    assert.ok("testimonials" in body.data);
    assert.ok("settings" in body.data);

    // Test conditional request ETag matching returns 304
    const cachedRes = await fetch(`${baseUrl}/api/v1/portfolio`, {
      headers: { "if-none-match": etag },
    });
    assert.equal(cachedRes.status, 304, "Subsequent request with matching If-None-Match must return 304");
  });
});
