import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "./app";
import { resetStore } from "./store";

const app = createApp();

beforeEach(() => {
    resetStore();
});

async function addPlayer(name: string): Promise<number> {
    const res = await request(app).post("/players").send({ name});
    return res.body.id as number;
}

function score(playerId: number, event = "Event 1") {
    return { playerId, event, points: 10, legsWon: 4};
}

test("create a score for an existing player", async () => {
    const id = await addPlayer("Amina");
    const res = await request(app).post("/scores").send(score(id));
    assert.deepEqual(res.body, {
        id: 1,
        playerId: id,
        event: "Event 1",
        points: 10,
        legsWon: 4,
    });
});

test("rejects a score for an unkwown player", async () => {
    const res = await request(app).post("/scores").send(score(99));
    assert.equal(res.status, 422);
})

test("rejects the same player twice in one event", async () => {
    const id = await addPlayer("Brian");
    await request(app).post("/scores").send(score(id));
    const res = await request(app).post("/scores").send(score(id));
    assert.equal(res.status, 409);
});

test("allows the same player in different events", async () => {
    const id = await addPlayer("Brian");
    await request(app).post("/scores").send(score(id, "Event 1"));
    const res = await request(app).post("/scores").send(score(id, "event 2"));
    assert.equal(res.status, 201);
});

test("rejects negative points", async () => {
    const id = await addPlayer("Kevin");
    const res = await request(app)
    .post("/scores")
    .send({ ...score(id), points: -1 });
    assert.equal(res.status, 400);
    assert.deepEqual(res.body.details, ["points must be 0 or more"]);
});

test("filter scores by event", async () => {
    const id = await addPlayer("Amina");
    await request(app).post("/scores").send(score(id, "Event 1"));
    await request(app).post("/scores").send(score(id, "Event 2"));
    const res = await request(app).get("/scores?event=event 2");
    assert.equal(res.body.length, 1);
    assert.equal(res.body[0].event, "Event 2");
});

test("deleting a player removes their scores", async () => {
    const id = await addPlayer("Amina");
    await request(app).post("/scores").send(score(id));
    await request(app).delete(`/players/${id}`);
    const res = await request(app).get("/scores");
    assert.deepEqual(res.body, []);
});

test("a non-numeric id returns 400",  async () => {
    const res = await request(app).get("/players/abc");
    assert.equal(res.status, 400);
});