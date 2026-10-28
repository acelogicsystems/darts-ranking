import { test } from "node:test";
import assert from "node:assert/strict";
import { rankByEvent } from "./events";

const data = [
    {player: "Brian", points: 10, legsWon: 4, event: "Event 1" },
    {player: "Amina", points: 8, legsWon:3, event: "Event 1" },
    {player: "Brian", points: 5, legsWon: 2, event: "Event 2"},
    {player: "Amina", points: 9, legsWon: 3, event: "Event 2"},
];

test("keeps events in CSV order", () => {
    assert.deepEqual([...rankByEvent(data).keys()], ["Event 1", "Event 2"]);
});

test("ranks each event separately", () => {
    const result = rankByEvent(data);
    assert.equal(result.get("Event 1")![0].player, "Brian");
    assert.equal(result.get("Event 2")![0].player,"Amina");
});

test("rows with no event go to unnamed event", () => {
    const result = rankByEvent([{player: "Kevin", points: 3, legsWon: 1 }]);
    assert.equal(result.get("Unnamed event")![0].rank, 1);
});
