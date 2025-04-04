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
  const [message, setMessage] = useState("");
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
    setMessage("");
  }, [currentGame]);

  const handleGameTabClick = (game) => {
    setCurrentGame(game);
  };

  const handleNextClip = () => {
    if (clip < 5) {
      setClip(prevClip => prevClip + 1);
      setGuess("");
    } else {
      setMessage("Game Over: You've seen all the clues. You lost.");
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
      setMessage("");
    } else {
      setIncorrectAnswers(prev => [...prev, guess]);
      if (clip < 5 && incorrectAnswers.length < 3) {
        handleNextClip();
        setMessage("");
      } else {
        setMessage("Game Over: You've seen all the clues. You lost.");
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

  // Render 4 guess input fields vertically. Only the active field is enabled.
  function renderGuessFields() {
    return [0, 1, 2, 3].map(i => {
      let value = "";
      let onChange = undefined;
      let isActive = false;
      // For submitted incorrect guesses.
      if (i < incorrectAnswers.length) {
        value = incorrectAnswers[i];
      }
      // Active field: next guess slot.
      if (
        i === incorrectAnswers.length &&
        !answeredCorrectly &&
        clip < 5 &&
        incorrectAnswers.length < 4
      ) {
        value = guess;
        onChange = (e) => setGuess(e.target.value);
        isActive = true;
      }
      // When answer is correct, show the correct answer in the active field.
      if (answeredCorrectly && i === incorrectAnswers.length) {
        value = meta.answer;
      }
      // Define the style.
      let inputStyle = { marginBottom: "10px", display: "block", width: "100%" };
      if (i < incorrectAnswers.length) {
        inputStyle.border = "2px solid red";
        inputStyle.backgroundColor = "#ffcccc";
      } else if (answeredCorrectly && i === incorrectAnswers.length) {
        inputStyle.border = "2px solid green";
        inputStyle.backgroundColor = "#ccffcc";
      }
      return (
        <input
          key={i}
          type="text"
          value={value}
          onChange={onChange}
          disabled={!isActive}
          style={inputStyle}
          ref={isActive ? activeInputRef : null}
        />
      );
    });
  }

  return (
    <div className="App">
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
      {/* Display metadata show and date */}
      <div className="game-info">
        <p><strong>Show:</strong> {meta.show}</p>
        <p><strong>Date:</strong> {meta.date}</p>
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
            ref={videoRef}
            key={clip}
            autoPlay
            onEnded={handleVideoEnded}
            width="640"
            height="360"
            src={`/clips/${currentGame}/${clip}.mp4`}
          >
            Your browser does not support the video tag.
          </video>
          <br />
          <h2>Guess the guest...</h2>
          <div className="guess-fields">
            {(!answeredCorrectly && clip < 5 && incorrectAnswers.length < 4) ? (
              <form onSubmit={handleSubmit}>
                {renderGuessFields()}
                <button type="submit">Submit Guess</button>
              </form>
            ) : (
              <>
                {renderGuessFields()}
              </>
            )}
          </div>
          {answeredCorrectly && <p>Congratulations, you got it right!</p>}
          {message && <p>{message}</p>}
          {(!answeredCorrectly && clip === 5) && (
            <p>Game Over: You've seen all the clues. You lost.</p>
          )}
        </>
      )}
    </div>
  );
}

export default App;