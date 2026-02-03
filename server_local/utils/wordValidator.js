import { VALID_WORDS } from '../data/words.js';

/**
 * Check if a word can be formed from the given letters
 * Each letter can only be used once
 */
export function canFormWord(word, availableLetters) {
  const letterCount = {};

  // Count available letters
  for (const letter of availableLetters) {
    const upperLetter = letter.toUpperCase();
    letterCount[upperLetter] = (letterCount[upperLetter] || 0) + 1;
  }

  // Check if word can be formed
  for (const letter of word.toUpperCase()) {
    if (!letterCount[letter] || letterCount[letter] === 0) {
      return false;
    }
    letterCount[letter]--;
  }

  return true;
}

/**
 * Check if a word is valid (exists in dictionary and meets minimum length)
 */
export function isValidWord(word, minLength = 3) {
  const normalizedWord = word.toLowerCase().trim();
  return normalizedWord.length >= minLength && VALID_WORDS.has(normalizedWord);
}

/**
 * Find all valid words that can be formed from given letters
 * Used for puzzle generation
 */
export function findAllValidWords(letters, minLength = 3) {
  const validWords = [];

  // Check each word in dictionary
  for (const word of VALID_WORDS) {
    if (word.length >= minLength && canFormWord(word, letters)) {
      validWords.push(word);
    }
  }

  return validWords;
}

/**
 * Generate a random set of letters
 * Ensures at least some vowels for playability
 */
export function generateLetters(count = 7) {
  const vowels = ['A', 'E', 'I', 'O', 'U'];
  const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'W', 'Y'];

  const letters = [];
  const numVowels = Math.floor(count / 3); // About 1/3 vowels
  const numConsonants = count - numVowels;

  // Add random vowels
  for (let i = 0; i < numVowels; i++) {
    letters.push(vowels[Math.floor(Math.random() * vowels.length)]);
  }

  // Add random consonants
  for (let i = 0; i < numConsonants; i++) {
    letters.push(consonants[Math.floor(Math.random() * consonants.length)]);
  }

  // Shuffle the letters
  return letters.sort(() => Math.random() - 0.5);
}
