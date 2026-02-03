import { createGame } from './db/gameDb.js';
import { setValidWords } from './db/gameResultsDb.js';
import { findAllValidWords } from './utils/wordValidator.js';

/**
 * Seed initial game data
 * Creates a game for today with predefined letters
 */
export function seedInitialData() {
  const today = new Date().toISOString().split('T')[0];

  // Mock letters for initial game
  const mockLetters = ['C', 'A', 'F', 'E', 'D', 'B', 'G'];

  // Create the game
  const game = createGame(today, mockLetters);

  // Generate and populate valid words
  const validWords = findAllValidWords(mockLetters);
  setValidWords(today, validWords);

  console.log(`🌱 Seeded game for ${today}:`, mockLetters.join(''), `(${validWords.length} possible words)`);

  return game;
}

/**
 * Seed game with custom letters
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {Array<string>} letters - Array of letter characters
 */
export function seedGame(date, letters) {
  const game = createGame(date, letters);
  const validWords = findAllValidWords(letters);
  setValidWords(date, validWords);

  console.log(`🌱 Seeded game for ${date}:`, letters.join(''), `(${validWords.length} possible words)`);

  return game;
}
