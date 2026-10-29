# Dart Ranking


![Tests](https:/github.com/acelogicsystems/darts-ranking/actions/workflows/ci.yml/badge.svg)

A small TypeScript engine that turns darts league scores into ranked
leaderboard and a whatApp- ready broadcast message.

## Features
- Totals points and legs won accrossevents
- Ranks by points, then legs won
- Ties share a rank and the next rank is skipped  (1, 1, 3)
- Separate leaderboard for each event, plus an overall one
- Reads scores from a CSV file, including quoted names and blank lines
- Formats results as a whatsApp message with ties grouped on one line
- Tests run automatically on every push with GitHub Actions

## CSV format
```
player,event,date,points,legsWon
Brian,Event 1,2026-10-01,10,4
Amina,Event 1,2026-10-01,10,4
```
Required columns: `player`, `points`, `legsWon`. The `event` column is optional.

## Usage
```

npm install
npm run rank                         # every event, then overall
npm run rank -- scores.csv "Event 2" # one evert only
npm test
```
## Example output
```

*DARTS RANKING - Event 1*

*1.* Amina / Brian - 10 pts
*3.* kevin - 7 pts
```

## Project structure
|File | Purpose |
|---|---|
| `ranking.ts` | Totals scores and assigns ranks, with tie handling |
| `events.ts` | Ranks each event separately |
| `csv.ts`, `loadCsv.ts` | CSV parsing and loading |
| `formatter.ts` | Builds the whatsApp message |
| `rankCsv.ts` | command-line entry point |


