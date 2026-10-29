import { test } from "node:test";
import assert from "node:assert";
import { parsePointsTable} from "./config";

test("accepts a plain list", () => {
    assert.deepEqual(parsePointsTable("[5, 3, 1]"), [5, 3, 1]);
});

test("accepts an object with a table", () => {
    assert.deepEqual(parsePointsTable('{"table": [9, 4]}'), [9, 4]);
});

test("rejects invalid JSON", () => {
    assert.throws(() => parsePointsTable("[10, 8,"), /not valid JSON/);
});

test("rejects negative or non-number values", () => {
    assert.throws(() => parsePointsTable("[10, -1]"), /non-negative/);
    assert.throws(() => parsePointsTable('[10, "a"]'), /non-negative/);
});

test("rejects an empty table", () => {
    assert.throws(() => parsePointsTable("[]"), /must be a list/);
});