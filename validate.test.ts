import { test } from "node:test";
import assert from "node:assert/strict";
import { findDuplicates } from "./validate";

test("finds the same player twice in one event", () => {
    const problems = findDuplicates([
        { player: "Brian", points: 5, legsWon: 2, event: "E1"},
        { player: "Brian", points: 6, legsWon: 2, event: "E1"},
    ]);
    assert.deepEqual(problems, ["Brian appears more than once in E1"]);
});

test("ignores case when matching names", () => {
    const problems = findDuplicates([
        { player: "Amina", points: 5, legsWon: 2, event: "E1"},
        { player: "amina", points: 6, legsWon: 2, event: "E1"},
    ]);
    assert.equal(problems.length, 1);
});

test("allow the same player in different events", () => {
    const problems = findDuplicates([
        { player: "Brian", points: 5, legsWon: 2, event: "E1"},
        { player: "Brian", points: 6, legsWon: 2, event: "E2"},
    ]);
    assert.deepEqual(problems, []);
});