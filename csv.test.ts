import { test } from "node:test";
import assert from "node:assert/strict";
import { parseLine } from "./csv";

test("splits a plain line", () => {
    assert.deepEqual(parseLine("a,b,c"), ["a", "b", "c"]);
});

test("trims spaces around cells", () => {
    assert.deepEqual(parseLine(" a , b "), ["a", "b"]);
});

test("keeps commas inside quotes", () => {
     assert.deepEqual(parseLine('"Otieno, Brian", 10'), ["Otieno, Brian", "10"]);
});

test("handles escaped quotes", () => {
    assert.deepEqual(parseLine('"He said ""hi""", 1'), ['He said "hi"', "1"]);
});