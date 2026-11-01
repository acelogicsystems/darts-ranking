import type { Profile } from "./profiles";

export type Meeting = {
    event: string;
    rankA: number;
    rankB: number;
    winner: string | null;
};

export type HeadToHead = {
    a: string;
    b: string;
    meetings: Meeting[];
    winsA: number;
    winsB: number;
    ties: number;
};

export function  headToHead(a: Profile, b: Profile): HeadToHead {
    const meetings: Meeting[] = [];

    for (const ra of a.results) {
        const rb = b.results.find((r) => r.event === ra.event);
        if (!rb) continue;
        meetings.push({
            event: ra.event,
            rankA: ra.rank,
            rankB: rb.rank,
            winner: ra.rank < rb.rank ? a.player : ra.rank > rb.rank ? b.player : null,
        });
    }

    return {
        a: a.player,
        b: b.player,
        meetings,
        winsA: meetings.filter((m) => m.winner === a.player).length,
        winsB: meetings.filter((m) => m.winner === b.player).length,
        ties: meetings.filter((m) => m.winner === null).length,
    };

}

export function findProfile(
    profiles: Profile[],
    name: string
): Profile | undefined {
    const q = name.trim().toLowerCase();
    return profiles.find((p) => p.player.toLowerCase() === q);
}