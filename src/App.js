import React, { useState, useRef, useEffect } from 'react';
import gameData from './gameData.json';
import './App.css';
import Header from './components/Header';
import VideoPlayer from './components/VideoPlayer';
import StartScreen from './components/StartScreen';
import GuessSection from './components/GuessSection';

function App() {
  const games = Object.keys(gameData);
  const [currentGame, setCurrentGame] = useState('game1');
  const [meta, setMeta] = useState(gameData[currentGame]);
  const [gameStarted, setGameStarted] = useState(false);
  const [clip, setClip] = useState(1);
  const [guess, setGuess] = useState("");
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  // Initialize darkMode from localStorage; default false if not set.
  const [darkMode, setDarkMode] = useState(
    () => JSON.parse(localStorage.getItem('darkMode')) || false
  );

  const videoRef = useRef(null);
  const activeInputRef = useRef(null);

  useEffect(() => {
    setMeta(gameData[currentGame]);
    setGameStarted(false);
    setClip(1);
    setGuess("");
    setIncorrectAnswers([]);
    setAnsweredCorrectly(false);
  }, [currentGame]);

  // Persist darkMode changes to localStorage.
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleGameTabClick = (game) => {
    setCurrentGame(game);
  };

  const handleNextClip = () => {
    if (clip < 5) {
      setClip(prev => prev + 1);
      setGuess("");
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (guess.trim().toLowerCase() === meta.answer.toLowerCase()) {
      setGuess(meta.answer);
      if (clip < 5) {
        setClip(prev => prev + 1);
      }
      setAnsweredCorrectly(true);
    } else {
      setIncorrectAnswers(prev => [guess, ...prev]);
      if (clip < 5 && (incorrectAnswers.length + 1) <= 4) {
        handleNextClip();
      }
      setGuess("");
    }
  };

  const handleVideoEnded = () => {
    if (answeredCorrectly && clip < 5) {
      setClip(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (answeredCorrectly && videoRef.current) {
      videoRef.current.play();
    }
  }, [clip, answeredCorrectly]);

  // Autofocus active input when game starts or guess changes.
  useEffect(() => {
    if (activeInputRef.current) {
      activeInputRef.current.focus();
    }
  }, [gameStarted, incorrectAnswers, guess]);

  if (!meta) {
    return (
      <div className="App">
        <h1 className="title">My Next Guest</h1>
        <p>Loading game data...</p>
      </div>
    );
  }

  return (
    <div className={darkMode ? "App dark" : "App"}>
      <Header 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        games={games} 
        currentGame={currentGame} 
        handleGameTabClick={handleGameTabClick} 
        meta={meta} 
      />

      {!gameStarted ? (
        <StartScreen onStart={() => setGameStarted(true)} />
      ) : (
        <>
          <VideoPlayer 
            videoRef={videoRef} 
            clip={clip} 
            currentGame={currentGame} 
            handleVideoEnded={handleVideoEnded} 
          />
          <br />
          <div className="guess-fields">
            <GuessSection
              darkMode={darkMode}
              guess={guess}
              incorrectAnswers={incorrectAnswers}
              answeredCorrectly={answeredCorrectly}
              meta={meta}
              handleSubmit={handleSubmit}
              activeInputRef={activeInputRef}
              clip={clip}
              handleGuessChange={setGuess}
            />
            {answeredCorrectly && <p>Congratulations, you got it right!</p>}
            {(!answeredCorrectly && clip === 5) && <p>Game Over: You lost.</p>}
          </div>
        </>
      )}
    </div>
  );
}

export default App;