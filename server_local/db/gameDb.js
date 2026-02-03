import { games } from '../storage.js';

/**
 * Get game by date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {object|null} Game object or null if not found
 */
export function getGame(date) {
  return games[date] || null;
}

/**
 * Create new game
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {Array<string>} letters - Array of letter characters
 * @returns {object} Created game object
 */
export function createGame(date, letters) {
  const game = {
    date,
    letters,
  };
  games[date] = game;
  return game;
}

/**
 * Check if game exists for a given date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {boolean} True if game exists
 */
export function gameExists(date) {
  return date in games;
}
