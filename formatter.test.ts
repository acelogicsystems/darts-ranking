import { test } from "node:test";
import assert from "node:assert/strict";
import { rankPlayers } from "./ranking";
import { formatBroadcast, formatSeasonBroadcast } from "./formatter";

test("formats a simple raning", () => {
    const ranked = rankPlayers([
        {player: "Amina", points: 18, legsWon: 7},
        {player: "Brian", points: 15, legsWon: 6},

    ]);
    assert.equal(
        formatBroadcast(ranked, "TEST"),
        "*TEST*\n\n*1.* Amina - 18 pts\n*2.* Brian - 15 pts"
    );
});

test("groups ties on one line and skips the next rank", () =>{
    const ranked = rankPlayers([
        {player: "Brian", points: 10, legsWon: 4},
        {player: "Amina", points: 10, legsWon: 4},
        {player: "Kevin", points: 7, legsWon: 3},
    ]);
    assert.equal(
        formatBroadcast(ranked, "TEST"),
        "*TEST*\n\n*1.* Amina / Brian - 10 pts\n*3.* Kevin - 7 pts"
    )
});
 test("formats the season table with ties grouped", () => {
    const rows = [
        { player: "Amina", seasonPoints: 20, wins: 2, events: 2, rank: 1},
        { player: "Brian", seasonPoints: 8, wins: 0, events: 2, rank: 2},
        { player: "Kevin", seasonPoints: 8, wins: 0, events: 2, rank: 2},
    ];
    assert.equal(
        formatSeasonBroadcast(rows, "TEST"),
        "*TEST*\n\n*1.* Amina - 20 pts\n*2.* Brian / Kevin - 8 pts"
    );
 });