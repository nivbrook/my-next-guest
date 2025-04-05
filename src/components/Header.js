import React from 'react';
import GameTabs from './GameTabs';
import GameInfo from './GameInfo';
import './Header.css';

function Header({ darkMode, setDarkMode, games, currentGame, handleGameTabClick, meta }) {
  return (
    <header className="header">
      <button
        className="dark-mode-toggle"
        onClick={() => setDarkMode(prev => !prev)}
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
      <h1 className="title">My Next Guest</h1>
      <GameTabs games={games} currentGame={currentGame} onTabClick={handleGameTabClick} />
      <GameInfo meta={meta} />
    </header>
  );
}

export default Header;