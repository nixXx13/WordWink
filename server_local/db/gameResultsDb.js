import { gameResults } from '../storage.js';

/**
 * Get all valid words for a game
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Array<string>} Array of valid words (empty if not found)
 */
export function getValidWords(date) {
  return gameResults[date] || [];
}

/**
 * Check if word is valid for specific game
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} word - Word to check (should be normalized)
 * @returns {boolean} True if word is valid for this game
 */
export function isValidWordForGame(date, word) {
  const validWords = gameResults[date];
  if (!validWords) return false;
  return validWords.includes(word);
}

/**
 * Populate valid words for a game
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {Array<string>} words - Array of valid words
 */
export function setValidWords(date, words) {
  gameResults[date] = words;
}
