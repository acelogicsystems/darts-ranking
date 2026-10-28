import { rankPlayers } from "./ranking";

const data = [
    {player: "Brian", points: 10, legsWon: 4},
    {player: "Amina", points: 10, legsWon: 5},
    {player: "Kevin", points: 7,  legsWon: 3},
    {player: "Brian", points: 5, legsWon: 2},
];

console.table(rankPlayers(data));
