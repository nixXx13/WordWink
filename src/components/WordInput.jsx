import React from 'react';
import './WordInput.css';

function WordInput({ currentWord, onSubmit, onClear, message }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && currentWord.length >= 3) {
      onSubmit();
    }
  };

  return (
    <div className="word-input-container">
      <div className="word-input">
        <div className="current-word">
          {currentWord || <span className="placeholder">Select letters...</span>}
        </div>
        <div className="word-actions">
          <button
            className="btn btn-clear"
            onClick={onClear}
            disabled={!currentWord}
          >
            Clear
          </button>
          <button
            className="btn btn-submit"
            onClick={onSubmit}
            disabled={currentWord.length < 3}
            onKeyDown={handleKeyDown}
          >
            Submit
          </button>
        </div>
      </div>
      {message && (
        <div className={`message ${message.includes('✨') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default WordInput;
