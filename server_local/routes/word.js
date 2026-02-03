import express from 'express';
import { gameExists } from '../db/gameDb.js';
import { isValidWordForGame } from '../db/gameResultsDb.js';
import { getUserAnswers, addUserAnswer, hasUserFoundWord } from '../db/userAnswersDb.js';

const router = express.Router();

/**
 * Response builder functions
 */
function sendMissingFieldsError(res) {
  return res.status(400).json({
    valid: false,
    error: 'MISSING_FIELDS',
    message: 'playerId, puzzleId, and word are required',
  });
}

function sendGameNotFoundError(res) {
  return res.status(404).json({
    valid: false,
    error: 'GAME_NOT_FOUND',
    message: 'Game not found for this date',
  });
}

function sendInvalidWordError(res, word) {
  return res.json({
    valid: false,
    word: word,
    error: 'INVALID_WORD',
    message: 'Word not valid for this game',
  });
}

function sendAlreadyFoundError(res, word) {
  return res.json({
    valid: false,
    word: word,
    error: 'ALREADY_FOUND',
    message: 'You already found this word!',
  });
}

function sendSuccessResponse(res, word, foundWords) {
  return res.json({
    valid: true,
    word: word,
    message: 'Word accepted!',
    progress: {
      foundWords: foundWords,
      count: foundWords.length,
    },
  });
}

/**
 * POST /api/word/submit
 * Submit a word for validation
 */
router.post('/submit', (req, res) => {
  try {
    const { playerId, puzzleId, word } = req.body;

    // Validate request
    if (!playerId || !puzzleId || !word) {
      return sendMissingFieldsError(res);
    }

    // Check if game exists
    if (!gameExists(puzzleId)) {
      return sendGameNotFoundError(res);
    }

    // Normalize word
    const normalizedWord = word.toLowerCase().trim();

    // Check if word is valid for this game (exists in GameResults)
    if (!isValidWordForGame(puzzleId, normalizedWord)) {
      return sendInvalidWordError(res, normalizedWord);
    }

    // Check if user already found this word
    if (hasUserFoundWord(playerId, puzzleId, normalizedWord)) {
      return sendAlreadyFoundError(res, normalizedWord);
    }

    // Add word to user's answers
    addUserAnswer(playerId, puzzleId, normalizedWord);

    // Get updated progress
    const foundWords = getUserAnswers(playerId, puzzleId);

    console.log(`✅ Player ${playerId} found: "${normalizedWord}" (${foundWords.length} total)`);

    // Success!
    return sendSuccessResponse(res, normalizedWord, foundWords);
  } catch (error) {
    console.error('Error submitting word:', error);
    res.status(500).json({
      valid: false,
      error: 'SERVER_ERROR',
      message: 'Failed to submit word',
    });
  }
});

export default router;
