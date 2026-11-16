import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "./app";
import { createMemoryStore } from "./memoryStore";


function freshApp() {
    return createApp(createMemoryStore());
}

test("health check", async () => {
    const res = await request(freshApp()).get("/health");
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { status: "ok" });
});

test("create a player and list it", async () => {
    const app = freshApp();
    const created = await request(app).post("/players").send({ name: "Amina" });
    assert.equal(created.status, 201);
    assert.deepEqual(created.body, { id: "1", name: "Amina" });

    const list = await request(app).get("/players");
    assert.deepEqual(list.body, [{ id: "1", name: "Amina" }]);
});

test("rejects an empty name", async () => {
    const res = await request(freshApp()).post("/players").send({ name: "   "});
    assert.equal(res.status, 400);
    assert.deepEqual(res.body.details, ["name is required"]);
});

test("rejects a duplicate name ignore case", async () => {
    const app = freshApp();
    await request(app).post("/players").send({ name: "Brian"});
    const res = await request(app).post("/players").send({ name: "brian"});
    assert.equal(res.status, 409);
});

test("deletes a player", async () => {
    const app = freshApp();
    await request(app).post("/players").send({ name: "Kevin"});
    const del = await request(app).delete("/players/1");
    assert.equal(del.status, 204);
    const again = await request(app).get("/players/1");
    assert.equal(again.status, 404);
});

test("rejects malformed JSON", async () => {
    const res = await request(freshApp())
    .post("/players")
    .set("Content-Type", "application/json")
    .send("{bad json}");
    assert.equal(res.status, 400);
});

test("returns 404 for a missing player", async () => {
    const res = await request(freshApp()).get("/players/99");
    assert.equal(res.status, 404);
});