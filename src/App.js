import React, { useState, useRef, useEffect } from 'react';
import gameData from './gameData.json';
import './App.css';

function App() {
  // Available games based on gameData keys.
  const games = Object.keys(gameData);
  // Set default game to game1.
  const [currentGame, setCurrentGame] = useState('game1');
  const [meta, setMeta] = useState(gameData[currentGame]);

  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [clip, setClip] = useState(1);
  const [guess, setGuess] = useState("");
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  const videoRef = useRef(null);
  const activeInputRef = useRef(null);

  // When the currentGame changes, update meta and reset game state.
  useEffect(() => {
    setMeta(gameData[currentGame]);
    setGameStarted(false);
    setClip(1);
    setGuess("");
    setIncorrectAnswers([]);
    setAnsweredCorrectly(false);
  }, [currentGame]);

  const handleGameTabClick = (game) => {
    setCurrentGame(game);
  };

  const handleNextClip = () => {
    if (clip < 5) {
      setClip(prevClip => prevClip + 1);
      setGuess("");
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (guess.trim().toLowerCase() === meta.answer.toLowerCase()) {
      setGuess(meta.answer);
      if (clip < 5) {
        setClip(prevClip => prevClip + 1);
      }
      setAnsweredCorrectly(true);
    } else {
      // Update the wrong guesses array.
      setIncorrectAnswers(prev => [guess, ...prev]);
      // Use (incorrectAnswers.length + 1) to account for the new guess.
      if (clip < 5 && (incorrectAnswers.length + 1) <= 4) {
        handleNextClip();
      }
      setGuess("");
    }
  };

  const handleVideoEnded = () => {
    if (answeredCorrectly && clip < 5) {
      setClip(prevClip => prevClip + 1);
    }
  };

  useEffect(() => {
    if (answeredCorrectly && videoRef.current) {
      videoRef.current.play();
    }
  }, [clip, answeredCorrectly]);

  // Autofocus the active input on game start and whenever inputs change.
  useEffect(() => {
    if (activeInputRef.current) {
      activeInputRef.current.focus();
    }
  }, [gameStarted, incorrectAnswers, guess]);

  // If no metadata is found, show a loading indicator.
  if (!meta) {
    return (
      <div className="App">
        <h1 className="title">My Next Guest</h1>
        <p>Loading game data...</p>
      </div>
    );
  }

  // Render guess section
  function renderGuessSection() {
    // A common container style – 400px wide and centered.
    const containerStyle = { width: "400", margin: "0 auto 20px" };

    if (answeredCorrectly) {
      return (
        <div style={containerStyle}>
          <form>
          <input
            type="text"
            value={meta.answer}
            disabled
            style={{
              padding: "8px",
              fontSize: "1rem",
              border: "2px solid " + (darkMode ? "#8f8" : "green"),
              backgroundColor: darkMode ? "#223622" : "#ccffcc",
              width: "100%"
            }}
          />
          {incorrectAnswers.map((g, idx) => {
            const inputStyle = {
              padding: "8px",
              fontSize: "1rem",
              border: "2px solid " + (darkMode ? "#f88" : "red"),
              backgroundColor: darkMode ? "#662323" : "#ffcccc",
              width: "100%"
            };
            return (
              <input key={idx} type="text" value={g} disabled style={inputStyle} />
            );
          })}
          </form>
        </div>
      );
    }

    return (
      <div style={containerStyle}>
        {/* The active input is inside a form so pressing Enter submits */}
        <form onSubmit={handleSubmit}>
          {clip !== 5 && 
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { handleSubmit(e); } }}
            placeholder="Guess the Guest"
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "1rem",
              border: "2px solid #ccc",
              borderRadius: "4px"
            }}
            ref={activeInputRef}
          />}
          {incorrectAnswers.map((g, idx) => {
            const inputStyle = {
              padding: "8px",
              fontSize: "1rem",
              border: "2px solid " + (darkMode ? "#f88" : "red"),
              backgroundColor: darkMode ? "#662323" : "#ffcccc",
              width: "100%"
            };
            return (
              <input key={idx} type="text" value={g} disabled style={inputStyle} />
            );
          })}

        </form>
      </div>
    );
  }

  return (
    <div className={darkMode ? "App dark" : "App"}>
      {/* Dark Mode Toggle in Top Right */}
      <button
        className="dark-mode-toggle"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
      {/* Global Title */}
      <h1 className="title">My Next Guest</h1>
      {/* Game selection tabs */}
      <div className="game-tabs">
        {games.map(game => (
          <button
            key={game}
            onClick={() => handleGameTabClick(game)}
            style={{
              fontWeight: currentGame === game ? 'bold' : 'normal',
              marginRight: '10px'
            }}
          >
            {game.toUpperCase()}
          </button>
        ))}
      </div>
      {/* Display metadata show and date without labels */}
      <div className="game-info">
        <p className="show">{meta.show} - {meta.date}</p>
      </div>
      {/* Start Game Screen */}
      {!gameStarted && (
        <div className="start-screen">
          <button onClick={() => setGameStarted(true)}>Start Game</button>
        </div>
      )}
      {/* Game Screen */}
      {gameStarted && (
        <>
          <video
            playsInline
            webkit-playsinline="true"
            controls={false}
            ref={videoRef}
            key={clip}
            autoPlay
            width="640"
            onEnded={handleVideoEnded}
            src={`${process.env.PUBLIC_URL}/clips/${currentGame}/${clip}.mp4`}
          >
            Your browser does not support the video tag.
          </video>
          <br />
          {/* Instead of a heading, we show the active guess area */}
          <div className="guess-fields">
            {renderGuessSection()}
            {answeredCorrectly && <p>Congratulations, you got it right!</p>}
            {(!answeredCorrectly && clip === 5) && (
              <p>Game Over: You lost.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;