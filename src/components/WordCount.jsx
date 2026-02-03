import React from 'react';
import './WordCount.css';

function WordCount({ count }) {
  return (
    <div className="word-count">
      <div className="count-number">{count}</div>
      <div className="count-label">words found</div>
    </div>
  );
}

export default WordCount;
