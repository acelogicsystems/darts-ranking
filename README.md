# Dart Ranking
![Tests](https:/github.com/acelogicsystems/darts-ranking/actions/workflows/ci.yml/badge.svg)
A small TypeScript engine that turns darts league scores into ranked
leaderboard and a whatApp- ready broadcast message.

## Features
- Totals points and legs won across events
- Rank by points, then legs won
- Ties share a rank and the nextrank is skipped (1, 1, 3)
- Reads scores from a CSV file
- Format the results as a whatsapp message with ties grouped

## CSV format 
'''
player, event, date, points, legsWon
Brian,Event 1, 2026-10-01, 10,4

## usage
'''
npm install
npm run rank
npm test
'''
