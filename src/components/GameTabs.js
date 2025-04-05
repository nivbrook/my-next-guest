import React from 'react';
import './GameTabs.css';

function GameTabs({ games, currentGame, onTabClick }) {
  return (
    <div className="game-tabs">
      {games.map(game => (
        <button
          key={game}
          className={currentGame === game ? "active" : ""}
          onClick={() => onTabClick(game)}
        >
          {game.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export default GameTabs;