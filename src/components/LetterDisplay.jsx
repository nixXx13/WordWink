import React from 'react';
import './LetterDisplay.css';

function LetterDisplay({ letters, selectedLetters, onLetterClick }) {
  return (
    <div className="letter-display">
      <div className="letters-grid">
        {letters.map((letter, index) => (
          <button
            key={index}
            className={`letter-tile ${selectedLetters.includes(index) ? 'selected' : ''}`}
            onClick={() => onLetterClick(letter, index)}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LetterDisplay;
