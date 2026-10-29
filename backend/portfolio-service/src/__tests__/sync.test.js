import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { generateToken, prisma } from "shared";

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

describe("Admin-to-Public Synchronization", () => {
  let app;
  let adminToken;
  let originalHero;

  before(async () => {
    // Import unified app from backend/src/app.js
    app = (await import("../../src/app.js")).default;
    await waitForServer(app);
    adminToken = generateToken("cmvsidfik00009z384ejkbgtk", "sisay3575@gmail.com", "ADMIN");

    // Save original hero state
    const res = await fetch(`${baseUrl}/api/v1/hero`);
    const json = await res.json();
    originalHero = json.data;
  });

  after(async () => {
    // Restore original hero state if needed
    if (originalHero) {
      await fetch(`${baseUrl}/api/v1/hero`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(originalHero),
      });
    }
    server?.close();
    try {
      await prisma.$disconnect();
    } catch {}
  });

  it("Admin update to Hero title instantly reflects in public portfolio API", async () => {
    const testTitle = `Full-Stack Developer & AI Learner [Test ${Date.now()}]`;

    // 1. Admin edits title
    const updateRes = await fetch(`${baseUrl}/api/v1/hero`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        ...originalHero,
        title: testTitle,
      }),
    });
    assert.equal(updateRes.status, 200, "Admin PUT /hero must succeed");

    // 2. Public API immediately reflects the change
    const publicRes = await fetch(`${baseUrl}/api/v1/portfolio`);
    assert.equal(publicRes.status, 200, "Public GET /portfolio must succeed");
    const publicData = await publicRes.json();
    assert.equal(publicData.data.hero.title, testTitle, "Public portfolio must reflect the new title immediately");
  });
});
