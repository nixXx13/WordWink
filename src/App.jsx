import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import LetterDisplay from './components/LetterDisplay';
import FoundWords from './components/FoundWords';
import WordCount from './components/WordCount';
import './App.css';
import { api } from '../convex/_generated/api.js';
import { useQuery, useMutation } from 'convex/react';

function App() {
  const [playerId, setPlayerId] = useState(null);
  const [puzzle, setPuzzle] = useState(null);
  const [foundWords, setFoundWords] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const gameDetails = useQuery(api.WordWinkClient.getGame, { date: '2026-02-08' }); // TODO - get current date
  const foundWordsData = useQuery(
    api.WordWinkClient.getFoundWords,
    gameDetails && playerId
      ? { playerId: playerId, gameId: gameDetails._id }
      : 'skip',
  );

  // Mutation for submitting words
  const submitWordMutation = useMutation(api.WordWinkClient.submitWord);

  useEffect(() => {
    if (gameDetails != null){
      setLoading(false);
      console.log( gameDetails);
      setPuzzle(gameDetails);
    }
  }, [gameDetails]);

  useEffect(() => {
    if (foundWordsData != null && foundWordsData.size !== 0) {
      console.log(foundWordsData.map(x=>x.word));
      setFoundWords(foundWordsData.map((x) => x.word));
    }
  }, [foundWordsData]);


  // Load or generate player ID
  useEffect(() => {
    let storedPlayerId = localStorage.getItem('wordwink-player-id');
    if (!storedPlayerId) {
      storedPlayerId = crypto.randomUUID();
      localStorage.setItem('wordwink-player-id', storedPlayerId);
    }
    setPlayerId(storedPlayerId);
  }, []);

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

    if (!gameDetails || !playerId) {
      setMessage('❌ Game not loaded yet!');
      return;
    }

    try {
      // Call Convex mutation
      const data = await submitWordMutation({
        word: currentWord,
        playerId: playerId,
        gameId: gameDetails._id,
      });

      if (data.valid) {
        setFoundWords(data.foundWords);
        setTimeout(() => {
          const strip = document.querySelector('.found-words-strip-wrapper .words-grid');
          if (strip) strip.scrollLeft = strip.scrollWidth;
        }, 50);
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
      setTimeout(() => {
        handleClear();
      }, 1500);
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
      {/* Mobile header — hidden on desktop */}
      <div className="mobile-header">
        <h1 className="title">WordWink</h1>
        {foundWords.length > 0 && (
          <span className="mobile-word-badge">
            {foundWords.length} word{foundWords.length !== 1 ? 's' : ''} ▾
          </span>
        )}
      </div>

      {/* Desktop header — hidden on mobile */}
      <header className="header">
        <h1 className="title">WordWink</h1>
        <p className="subtitle">Find as many words as you can!</p>
      </header>

      {/* Found words strip — mobile only, outside game-container to avoid layout shift */}
      {foundWords.length > 0 && (
        <div className="found-words-strip-wrapper">
          <FoundWords words={foundWords} />
        </div>
      )}

      <main className="game-container">
        {/* Desktop panels — hidden on mobile */}
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
          {/* Inline message — overlaid on current-word-display on mobile */}
          {message && (
            <div className={`message message--inline ${message.includes('✨') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </div>

        {/* Standalone message — desktop only */}
        <div className={`message message--standalone ${message ? (message.includes('✨') ? 'success' : 'error') : 'hidden'}`}>
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
              <span className="btn-icon">×</span>
              Clear
            </button>
            <button
              className="btn btn-submit"
              onClick={handleSubmit}
              disabled={!currentWord}
            >
              <span className="btn-icon">✓</span>
              Submit
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
