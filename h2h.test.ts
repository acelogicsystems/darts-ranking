import { test } from "node:test";
import assert from "node:assert/strict";
import { buildProfiles} from  "./profiles";
import { headToHead, findProfile } from "./h2h";

const data = [
    { player: "Brian", points: 10, legsWon: 4, event: "Event 1"},
    { player: "Amina", points: 10, legsWon: 4, event: "Event 1"},
    { player: "Kevin", points: 7, legsWon: 3, event: "Event 1"},
    { player: "Brian", points: 5, legsWon: 2, event: "Event 2"},
    { player: "Amina", points: 8, legsWon: 3, event: "Event 2"},
];

test("compares two players in shared events", () => {
    const profiles = buildProfiles(data);
    const r = headToHead(
        findProfile(profiles, "Amina")!,
        findProfile(profiles, "Brian")!
    );
    assert.deepEqual(
        r.meetings.map((m) => [m.event, m.winner]),
        [["Event 1", null], ["Event 2", "Amina"]]
    );
    assert.equal(r.winsA, 1);
    assert.equal(r.winsB, 0);
    assert.equal(r.ties, 1);
});

test("players who never met have no meetings", () => {
    const profiles = buildProfiles([
        { player: "X", points: 5, legsWon: 1, event: "E1"},
        { player: "Y", points: 5, legsWon: 1, event: "E2"},

    ]);
    const r = headToHead(
        findProfile(profiles, "X")!,
        findProfile(profiles, "Y")!
    );
    assert.deepEqual(r.meetings, []);
    assert.equal(r.winsA + r.winsB + r.ties, 0);
});

test("finds a profile ignoring case and spaces", () => {
    const profiles = buildProfiles(data);
    assert.equal(findProfile(profiles, " Kevin ")?.player, "Kevin");
    assert.equal(findProfile(profiles, "Nobody"), undefined);
})