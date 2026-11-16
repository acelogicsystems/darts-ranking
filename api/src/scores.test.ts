import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import type { Express } from "express";
import { createApp } from "./app";
import { createMemoryStore } from "./memoryStore";

function freshApp() {
    return createApp(createMemoryStore());
}

async function addPlayer(app: Express, name: string): Promise<string> {
    const res = await request(app).post("/players").send({ name });
    return res.body.id as string;
}

function score(playerId: string, event = "Event 1") {
    return { playerId, event, points: 10, legsWon: 4 };
}

test("creates a score for an existing player", async () => {
    const app = freshApp();
    const id = await addPlayer(app, "Amina");
    const res = await request(app).post("/scores").send(score(id));
    assert.equal(res.status, 201);
    assert.deepEqual( res.body, {
        id: "1",
        playerId: id,
        event: "Event 1",
        points: 10,
        legsWon: 4,

    });
});

test("rejects a score for an unknown player", async () => {
    const res = await request(freshApp()).post("/scores").send(score("99"));
    assert.equal(res.status, 422);
});

test("rejects the same player twice in one event", async () => {
    const app = freshApp();
    const id = await addPlayer(app, "Brian");
    await request(app).post("/scores").send(score(id, "Event 1"));
    const res = await request(app).post("/scores").send(score(id, "Event 2"));
    assert.equal(res.status, 201);
});

test("rejects negative points", async () => {
    const app = freshApp();
    const id = await addPlayer(app, "Kevin");
    const res = await request(app)
    .post("/scores")
    .send({ ...score(id), points: -1 });
    assert.equal(res.status, 400);
    assert.deepEqual(res.body.details, ["points must be 0 or more"]);
});

test("filters scores by event", async () => {
    const app = freshApp();
    const id = await addPlayer(app, "Amina");
    await request(app).post("/scores").send(score(id, "Event 1"));
    await request(app).post("/scores").send(score(id, "Event 2"));
    const res = await request(app).get("/scores?event=event%202");
    assert.equal(res.body.length, 1);
    assert.equal(res.body[0].event, "Event 2");

});

test("deleting a player removes their scores", async () => {
    const app = freshApp();
    const id = await addPlayer(app, "Amina");
    await request(app).post("/scores").send(score(id));
    await request(app).delete(`/players/${id}`);
    const res = await request(app).get("/scores");
    assert.deepEqual(res.body, []);
});

test("an unknown id returns 404", async () => {
    const res = await request(freshApp()).get("/players/abc");
    assert.equal(res.status, 404);
});

test("allows the same player in different events", async () => {
    const app = freshApp();
    const id = await addPlayer(app, "Brian");
    await request(app).post("/scores").send(score(id, "Event 1"));
    const res = await request(app).post("/scores").send(score(id, "Event 2"));
    assert.equal(res.status, 201);
})