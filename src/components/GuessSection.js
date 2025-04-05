import React from 'react';
import './GuessSection.css';

function GuessSection({ 
  darkMode, 
  guess, 
  clip, 
  incorrectAnswers, 
  answeredCorrectly, 
  meta, 
  handleSubmit, 
  activeInputRef,
  handleGuessChange
}) {
  return (
    <div className="guess-container">
      <form onSubmit={handleSubmit}>
        {answeredCorrectly ? (
          <input
            type="text"
            value={meta.answer}
            disabled
            className={"guess-correct"}
          />
        ) : (
          clip !== 5 && (
            <input
              type="text"
              value={guess}
              onChange={(e) => handleGuessChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(e);
                }
              }}
              placeholder="Guess the Guest"
              className="guess-active"
              ref={activeInputRef}
            />
          )
        )}
        {incorrectAnswers.map((g, idx) => (
          <input
            key={idx}
            type="text"
            value={g}
            disabled
            className="guess-wrong"
          />
        ))}
      </form>
    </div>
  );
}

export default GuessSection;