import { test } from "node:test";
import assert from "node:assert/strict";
import { seasonStandings } from "./season";

const data = [
    { player: "Brian", points: 10, legsWon: 4, event: "Event 1"},
    { player: "Amina", points: 10, legsWon: 4, event: "Event 1"},
    { player: "Kevin", points: 7, legsWon: 3, event: "Event 1"},
    { player: "Brian", points: 5, legsWon: 2, event: "Event 2"},
    { player: "Amina", points: 8, legsWon: 3, event: "Event 2"},
];

test("awards points by finishing place, ties share the place", () => {
    const result = seasonStandings(data);
    assert.deepEqual(
        result.map((r) => [r.player, r.seasonPoints, r.rank]),
        [
            ["Amina", 20, 1],
            ["Brian", 18, 2],
            ["Kevin", 6, 3],
        ]
    );
});

test("places beyond the table earn 0 points", () => {
    const result = seasonStandings(
        [
            { player: "A", points: 5, legsWon: 1, event: "E1"},
            {player: "B", points: 3, legsWon: 1, event: "E1"},
        ],
        [10]
    );
    assert.equal(result[1].seasonPoints, 0);
});

test("wins break a season points tie", () => {
    const two =[
        { player: "P1", points: 9, legsWon: 3, event: "A"},
        { player: "P2", points: 4, legsWon: 1, event: "A"},
        { player: "P1", points: 9, legsWon: 3, event: "B"},
         {player: "P2", points: 4, legsWon:1, event: "B"},
    ];
    const result = seasonStandings(two, [5,5]);
    assert.equal(result[0].player, "P1");
    assert.equal(result[0].seasonPoints, result[1].seasonPoints);
    assert.deepEqual(result.map((r) => r.rank), [1, 2]);
});

test("equal points and wins share a rank", () => {
    const result = seasonStandings([
        { player: "A", points: 6, legsWon: 2, event: "E1"},
        {player: "B", points: 6, legsWon: 2, event: "E1"},
    ]);
    assert.deepEqual(result.map((r) => r.rank), [1, 1]);
});