// In-memory storage for development
// New table-based structure

/**
 * Game Table
 * Key: date (YYYY-MM-DD)
 * Value: { date, letters }
 */
export const games = {};

/**
 * GameResults Table
 * Key: date (YYYY-MM-DD)
 * Value: Array of valid words that can be formed from that game's letters
 */
export const gameResults = {};

/**
 * UserGameAnswers Table
 * Key: playerId (UUID)
 * Value: { date: Set(words) }
 */
export const userGameAnswers = {};

/**
 * Helper function to ensure player/date entry exists
 */
export function ensurePlayerDateEntry(playerId, date) {
  if (!userGameAnswers[playerId]) {
    userGameAnswers[playerId] = {};
  }
  if (!userGameAnswers[playerId][date]) {
    userGameAnswers[playerId][date] = new Set();
  }
}
