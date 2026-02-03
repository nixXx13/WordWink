import React from 'react';
import './FoundWords.css';

function FoundWords({ words }) {
  return (
    <div className="found-words">
      <h2 className="panel-title">Found Words</h2>
      {words.length === 0 ? (
        <p className="empty-message">No words found yet. Start playing!</p>
      ) : (
        <div className="words-grid">
          {words.map((word, index) => (
            <div key={index} className="word-chip">
              {word}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FoundWords;
