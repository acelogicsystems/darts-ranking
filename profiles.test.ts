import { test } from "node:test"
import assert from "node:assert/strict";
import { buildProfiles } from "./profiles";

const data = [
    { player: "Brian", points: 10, legsWon: 4, event: "Event 1"},
    { player: "Amina", points: 10, legsWon: 4, event: "Event 1"},
    { player: "Kevin", points: 7, legsWon: 3, event: "Event 1"},
    { player: "Brian", points: 5, legsWon: 2, event: "Event 2"},
    { player: "Amina", points: 8, legsWon: 3, event: "Event 2"},
];

test("builds a full record for player", () => {
    const brian = buildProfiles(data).find((p) => p.player === "Brian")!;
    assert.deepEqual(brian.results.map((r) => r.rank), [1, 2]);
    assert.equal(brian.wins, 1);
    assert.equal(brian.podiums, 2);
    assert.equal(brian.bestRank, 1);
    assert.equal(brian.averageRank, 1.5);
    assert.equal(brian.totalPoints, 15);
    assert.equal(brian.seasonPoints, 18);
});

test("form shows only the last three finishes", () => {
    const rows = [
        { player: "Z", points: 9, legsWon: 3, event: "E1"},
        { player: "P", points: 1, legsWon: 0, event: "E1"},
        { player: "Z", points: 9, legsWon: 3, event: "E2"},
        { player: "P", points: 1, legsWon: 0, event: "E2"},
        { player: "P", points: 9, legsWon: 3, event: "E3"},
        { player: "Z", points: 1, legsWon: 0, event: "E3"},
        { player: "P", points: 9, legsWon: 3, event: "E4"},
        { player: "Z", points: 1, legsWon: 0, event: "E4"},
    ];
    const p = buildProfiles(rows).find((x) => x.player === "P")!;
    assert.equal(p.events, 4);
    assert.deepEqual(p.form, [2, 1, 1]);
});

test("profiles are sorted by player name", () => {
    assert.deepEqual(
        buildProfiles(data).map((p) => p.player),
        ["Amina", "Brian", "Kevin"]
    );
});