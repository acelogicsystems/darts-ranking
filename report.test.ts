import { test } from "node:test";
import assert from "node:assert/strict";
import { buildReport } from "./report";

const data = [
    { player: "Brian", points: 10, legsWon: 4, event: "Event 1" },
    { player: "Amina", points: 10, legsWon: 4, event: "Event 1" },
    { player: "Kevin", points: 7, legsWon: 3, event: "Event 1" },
    { player: "Brian", points: 5, legsWon: 2, event: "Event 2" },
    { player: "Amina", points: 8, legsWon: 3, event: "Event 2" },
];

test("builds events, overall and season tables", () => {
    const r = buildReport(data);
    assert.deepEqual(r.events.map((e) => e.name), ["Event 1", "Event 2"]);
    assert.equal(r.overall[0].player, "Amina");
    assert.equal(r.overall[0].points, 18);
    assert.equal(r.season[0].seasonPoints, 20);

});

test("survives a round trip through JSON", () => {
    const r = buildReport(data);
    assert.deepEqual(JSON.parse(JSON.stringify(r)), r);
});

test("includes a profile for every player",  () => {
    const r = buildReport(data);
    assert.deepEqual(
        r.profiles.map((p) => p.player),
        ["Amina", "Brian", "Kevin"]
    );
});