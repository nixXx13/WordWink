import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Games table - stores daily game data
  games: defineTable({
    date: v.string(), // YYYY-MM-DD format
    letters: v.array(v.string()), // Array of letter characters
  }).index('by_date', ['date']),

  // GameResults table - stores valid words for each game
  gameWords: defineTable({
    gameId: v.id('games'),
    validWords: v.array(v.string()), // Array of valid words
  }).index('by_gameId', ['gameId']),

  // UserGameAnswers table - stores user's found words
  foundWords: defineTable({
    playerId: v.string(), // Player UUID
    gameId: v.id('games'),
    word: v.string(), // Found word (normalized)
  })
    .index('by_player_and_date', ['playerId', 'gameId'])
    .index('by_player_date_word', ['playerId', 'gameId', 'word']),
});
