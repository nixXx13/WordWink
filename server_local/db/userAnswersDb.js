import { userGameAnswers, ensurePlayerDateEntry } from '../storage.js';

/**
 * Get user's found words for a game
 * @param {string} playerId - Player UUID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Array<string>} Array of words user has found (converted from Set)
 */
export function getUserAnswers(playerId, date) {
  ensurePlayerDateEntry(playerId, date);
  return Array.from(userGameAnswers[playerId][date]);
}

/**
 * Add a word to user's answers
 * @param {string} playerId - Player UUID
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} word - Word to add (should be normalized)
 */
export function addUserAnswer(playerId, date, word) {
  ensurePlayerDateEntry(playerId, date);
  userGameAnswers[playerId][date].add(word);
}

/**
 * Check if user already found this word
 * @param {string} playerId - Player UUID
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} word - Word to check (should be normalized)
 * @returns {boolean} True if user has already found this word
 */
export function hasUserFoundWord(playerId, date, word) {
  ensurePlayerDateEntry(playerId, date);
  return userGameAnswers[playerId][date].has(word);
}

/**
 * Get count of words user has found
 * @param {string} playerId - Player UUID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {number} Count of found words
 */
export function getUserAnswerCount(playerId, date) {
  ensurePlayerDateEntry(playerId, date);
  return userGameAnswers[playerId][date].size;
}
