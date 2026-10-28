import { test } from "node:test";
import assert from "node:assert/strict";
import { rankPlayers } from "./ranking";

test ("totals point across events", () => {
    const result = rankPlayers([
        { player: "Brian", points: 10, legsWon: 4},
        {player: "Brian", points: 5, legsWon: 2},
    ]);
    assert.equal(result[0].points, 15)
    assert.equal(result[0].legsWon, 6)
});

test("rank by points, highest first", () => {
    const result = rankPlayers([
        { player: "Kevin", points: 7, legsWon: 3},
        {player: "Amina", points: 10, legsWon: 4},
    ]);
    assert.equal(result[0].player, "Amina");
    assert.equal(result[0].rank, 1);
    assert.equal(result[1].rank, 2);
});

test("ties share a rank and the next rank skips", () => {
    const result = rankPlayers([
        {player: "Brian", points: 10, legsWon: 4},
        {player: "Amina", points: 10, legsWon: 4},
        {player: "Kevin", points: 7, legsWon: 3},
    ]);
    assert.deepEqual(
        result.map((r) => r.rank),
        [1,1,3]
    );
});

test("legs won break a point tie", () => {
    const result = rankPlayers([
        {player: "Amina", points: 10, legsWon: 3},
        {player: "Brian", points: 10, legsWon: 5},
    ]);
    assert.equal(result[0].player, "Brian");
    assert.equal(result[0].rank, 1);
    assert.equal(result[1].rank, 2);
});
