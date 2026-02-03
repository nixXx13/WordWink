import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import LetterDisplay from './components/LetterDisplay';
import FoundWords from './components/FoundWords';
import WordCount from './components/WordCount';
import './App.css';

const API_URL = 'http://localhost:3005/api';

function App() {
  const [playerId, setPlayerId] = useState(null);
  const [puzzle, setPuzzle] = useState(null);
  const [foundWords, setFoundWords] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load or generate player ID
  useEffect(() => {
    let storedPlayerId = localStorage.getItem('wordwink-player-id');
    if (!storedPlayerId) {
      storedPlayerId = crypto.randomUUID();
      localStorage.setItem('wordwink-player-id', storedPlayerId);
    }
    setPlayerId(storedPlayerId);
  }, []);

  // Fetch daily puzzle
  useEffect(() => {
    if (!playerId) return;

    const fetchPuzzle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/puzzle/daily`, {
          headers: {
            'X-Player-ID': playerId,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch puzzle');
        }

        const data = await response.json();
        setPuzzle(data);
        setFoundWords(data.progress.foundWords || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching puzzle:', err);
        setError('Failed to load puzzle. Please refresh the page.');
        setLoading(false);
      }
    };

    fetchPuzzle();
  }, [playerId]);

  const handleLetterClick = (letter, index) => {
    if (selectedLetters.includes(index)) {
      // Deselect letter
      const newSelectedLetters = selectedLetters.filter(i => i !== index);
      setSelectedLetters(newSelectedLetters);
      setCurrentWord(newSelectedLetters.map(i => puzzle.letters[i]).join(''));
    } else {
      // Select letter
      const newSelectedLetters = [...selectedLetters, index];
      setSelectedLetters(newSelectedLetters);
      setCurrentWord(newSelectedLetters.map(i => puzzle.letters[i]).join(''));
    }
    setMessage('');
  };

  const handleCurrentWordLetterClick = (indexInSelected) => {
    const newSelectedLetters = selectedLetters.filter((_, i) => i !== indexInSelected);
    setSelectedLetters(newSelectedLetters);
    setCurrentWord(newSelectedLetters.map(i => puzzle.letters[i]).join(''));
    setMessage('');
  };

  const handleClear = () => {
    setCurrentWord('');
    setSelectedLetters([]);
    setMessage('');
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
    });
  };

  const triggerErrorEffect = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.4 },
      colors: ['#ff6b6b', '#ee5a6f', '#ff9999'],
      gravity: 2,
      drift: 0,
      ticks: 100,
      scalar: 0.8,
    });
  };

  const handleSubmit = async () => {
    if (currentWord.length < 3) {
      triggerErrorEffect();
      setMessage('❌ Word must be at least 3 letters!');
      setTimeout(() => {
        handleClear();
      }, 1500);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/word/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId,
          puzzleId: puzzle.puzzleId,
          word: currentWord,
        }),
      });

      const data = await response.json();

      if (data.valid) {
        setFoundWords(data.progress.foundWords);
        setMessage(`✨ "${currentWord.toUpperCase()}" accepted!`);
        triggerConfetti();
        handleClear();
      } else {
        triggerErrorEffect();
        switch (data.error) {
          case 'ALREADY_FOUND':
            setMessage('❌ You already found this word!');
            break;
          case 'INVALID_WORD':
            setMessage('❌ Not a valid word!');
            break;
          case 'INVALID_LETTERS':
            setMessage('❌ Cannot form this word from available letters!');
            break;
          default:
            setMessage('❌ ' + data.message);
        }
        setTimeout(() => {
          handleClear();
        }, 1500);
      }
    } catch (err) {
      console.error('Error submitting word:', err);
      setMessage('❌ Failed to submit word. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="app loading">
        <div className="loading-spinner">Loading puzzle...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app error">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">WordWink</h1>
        <p className="subtitle">Find as many words as you can!</p>
      </header>

      <main className="game-container">
        <div className={`panels ${foundWords.length === 0 ? 'empty' : ''}`}>
          <WordCount count={foundWords.length} />
          {foundWords.length > 0 && <FoundWords words={foundWords} />}
        </div>

        <div className="current-word-display">
          {selectedLetters.map((letterIndex, i) => (
            <span
              key={i}
              className="current-word-letter"
              onClick={() => handleCurrentWordLetterClick(i)}
            >
              {puzzle.letters[letterIndex]}
            </span>
          ))}
        </div>

        <div className={`message ${message ? (message.includes('✨') ? 'success' : 'error') : 'hidden'}`}>
          {message || '\u00A0'}
        </div>

        <div className="controls-section">
          <LetterDisplay
            letters={puzzle?.letters || []}
            selectedLetters={selectedLetters}
            onLetterClick={handleLetterClick}
          />

          <div className="action-buttons">
            <button
              className="btn btn-clear"
              onClick={handleClear}
              disabled={!currentWord}
            >
              Clear
            </button>
            <button
              className="btn btn-submit"
              onClick={handleSubmit}
              disabled={!currentWord}
            >
              Submit
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
