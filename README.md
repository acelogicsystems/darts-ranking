# Dart Ranking


![Tests](https:/github.com/acelogicsystems/darts-ranking/actions/workflows/ci.yml/badge.svg)

A small TypeScript engine that turns darts league scores into ranked
leaderboard and a whatApp- ready broadcast message.

## Features
- Totals points and legs won accrossevents
- Ranks by points, then legs won
- Ties share a rank and the next rank is skipped  (1, 1, 3)
- Separate leaderboard for each event, plus an overall one
- Season standings: points awarded by finishing place in each event
- Configurble season season points table loaded from a JSON file
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
npm run rank -- scores.csv "Event 2" # one event only
npm run rank -- scores.csv --season  #season standings
npm run rank -- scores.csv --season --points=points.json
npm test
```
## Publishing the leaderboard
After adding results to `scores.csv`:
```
npm run site

git add . && git commit -m "Update results" && git push
```
GitHub Pages serves the `docs` folder, so the site updates within a minute.
## Season points
Each event awards season points by finishing place. The default table is
10, 8, 6, 5, 4, 3, 2, 1 and places beyond the table earn 0.

- Tied players share a place and each receives that place's points
- The season table is ranked by season points, then by event wins

To change the rules, edit `points.json`:
```json
{ "table": [15, 10, 7, 5, 3, 1] }
```

## Example output
```

*DARTS RANKING - SEASON*

*1.* Amina - 20 pts
*2.* Brian - 18pts
*3.* kevin - 6 pts
```

## Project structure
|File | Purpose |
|---|---|
| `ranking.ts` | Totals scores and assigns ranks, with tie handling |
| `events.ts` | Ranks each event separately |
| `season.ts` | Season standings from finishing places |
| `config.ts` | Loads and validates the points table |
| `csv.ts`, `loadCsv.ts` | CSV parsing and loading |
| `formatter.ts` | Builds the whatsApp message |
| `rankCsv.ts` | command-line entry point |


