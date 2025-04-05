import React from 'react';
import './GameInfo.css';

function GameInfo({ meta }) {
  return (
    <div className="game-info">
      <p className="show">
        {meta.show} - {meta.date}
      </p>
    </div>
  );
}

export default GameInfo;