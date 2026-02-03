import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { generateLetters, findAllValidWords } from '../utils/wordValidator.js';
import { getGame, createGame, gameExists } from '../db/gameDb.js';
import { setValidWords } from '../db/gameResultsDb.js';
import { getUserAnswers } from '../db/userAnswersDb.js';

const router = express.Router();

// Mock data for development - these are predefined puzzles
const MOCK_PUZZLES = [
  { letters: ['C', 'A', 'F', 'E', 'D', 'B', 'G'], puzzleId: 'mock-1' },
  { letters: ['S', 'T', 'A', 'R', 'E', 'D', 'L'], puzzleId: 'mock-2' },
  { letters: ['P', 'L', 'A', 'N', 'E', 'T', 'S'], puzzleId: 'mock-3' },
];

/**
 * GET /api/puzzle/daily
 * Get the current day's puzzle
 */
router.get('/daily', (req, res) => {
  try {
    // Get or create player ID
    let playerId = req.headers['x-player-id'] || req.query.playerId;
    if (!playerId) {
      playerId = uuidv4();
    }

    // Get today's date
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const puzzleId = today;

    // Check if game exists for today
    let game = getGame(today);

    if (!game) {
      // Use first mock puzzle for now, or generate random
      const useMock = true; // Toggle this to test random generation

      let letters;
      if (useMock && MOCK_PUZZLES.length > 0) {
        const mockIndex = 0; // Use first mock puzzle
        letters = MOCK_PUZZLES[mockIndex].letters;
      } else {
        // Generate random puzzle
        letters = generateLetters(7);
      }

      // Create the game
      game = createGame(today, letters);

      // Generate and populate valid words for this game
      const validWords = findAllValidWords(letters);
      setValidWords(today, validWords);

      console.log(`📅 Created new puzzle for ${today}:`, letters.join(''), `(${validWords.length} possible words)`);
    }

    // Get player's progress for this puzzle
    const foundWords = getUserAnswers(playerId, puzzleId);

    res.json({
      puzzleId: game.date,
      letters: game.letters,
      playerId: playerId,
      progress: {
        foundWords: foundWords,
        count: foundWords.length,
      },
    });
  } catch (error) {
    console.error('Error getting daily puzzle:', error);
    res.status(500).json({ error: 'Failed to get puzzle' });
  }
});

/**
 * GET /api/puzzle/:puzzleId/progress/:playerId
 * Get player's progress for a specific puzzle
 */
router.get('/:puzzleId/progress/:playerId', (req, res) => {
  try {
    const { puzzleId, playerId } = req.params;

    const foundWords = getUserAnswers(playerId, puzzleId);

    res.json({
      puzzleId,
      foundWords: foundWords,
      count: foundWords.length,
    });
  } catch (error) {
    console.error('Error getting progress:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

export default router;
