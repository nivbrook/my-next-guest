import React from 'react';
import './StartScreen.css';

function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <button onClick={onStart}>Start Game</button>
    </div>
  );
}

export default StartScreen;