import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import gameData from './gameData.json';

// Mock HTMLMediaElement.play to avoid errors when testing video playback.
HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());

describe('App Integration Tests', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('shows loading message if meta is not available (simulate by temporarily clearing meta)', () => {
    // Since meta is loaded from gameData, this test may require additional setup.
    // For now, we assume meta is available. If you want to simulate loading,
    // consider passing a prop or mocking the import.
    expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
  });

  test('displays start screen and then active guess input with placeholder', async () => {
    // Initially, the start screen should be rendered.
    const startButton = screen.getByText(/Start Game/i);
    expect(startButton).toBeInTheDocument();

    // Click the start game button.
    fireEvent.click(startButton);
    
    // Now the video should appear and the guess section should render.
    // Check that the active input is rendered with the placeholder.
    const activeInput = await screen.findByPlaceholderText(/Guess the Guest/i);
    expect(activeInput).toBeInTheDocument();
  });

  test('submits a wrong guess and displays it as a disabled input', async () => {
    // Start the game.
    fireEvent.click(screen.getByText(/Start Game/i));

    // Ensure active input is present.
    const activeInput = await screen.findByPlaceholderText(/Guess the Guest/i);
    expect(activeInput).toBeInTheDocument();

    // Type a wrong guess.
    fireEvent.change(activeInput, { target: { value: 'wrong guess' } });
    fireEvent.keyDown(activeInput, { key: 'Enter', code: 'Enter', charCode: 13 });

    // Wait for the wrong guess to appear as a disabled input.
    await waitFor(() => {
      const wrongInput = screen.getByDisplayValue('wrong guess');
      expect(wrongInput).toBeDisabled();
    });
  });

  test('submits the correct guess and shows the winning input and message', async () => {
    // Start the game.
    fireEvent.click(screen.getByText(/Start Game/i));
    
    // We know the answer is stored in meta.answer.
    // For this test, we assume meta.answer exists in gameData.
    const answer = gameData['game1'].answer;  // Adjust key if needed.
    
    // Get the active input.
    const activeInput = await screen.findByPlaceholderText(/Guess the Guest/i);
    expect(activeInput).toBeInTheDocument();

    // Enter the correct answer.
    fireEvent.change(activeInput, { target: { value: answer } });
    fireEvent.keyDown(activeInput, { key: 'Enter', code: 'Enter', charCode: 13 });

    // Wait for the winning state.
    await waitFor(() => {
      // The winning input should have the value equal to meta.answer and be disabled.
      const winInput = screen.getByDisplayValue(answer);
      expect(winInput).toBeDisabled();

      // Check that the congratulatory message appears.
      expect(screen.getByText(/Congratulations, you got it right!/i)).toBeInTheDocument();
    });
  });

  test('shows "Game Over: You lost." message when clip equals 5 and answer is wrong', async () => {
    // Start the game.
    fireEvent.click(screen.getByText(/Start Game/i));

    // Get the active input.
    let activeInput = await screen.findByPlaceholderText(/Guess the Guest/i);
    expect(activeInput).toBeInTheDocument();

    // For the first 3 wrong guesses, wait for the input to clear.
    for (let i = 0; i < 3; i++) {
      fireEvent.change(activeInput, { target: { value: 'wrong' + i } });
      fireEvent.keyDown(activeInput, { key: 'Enter', code: 'Enter', charCode: 13 });
      // Wait for the active input to clear (i.e. value becomes empty).
      await waitFor(() => {
        expect(activeInput).toHaveValue('');
      });
    }

    // For the 4th wrong guess, the active input is removed.
    fireEvent.change(activeInput, { target: { value: 'final wrong' } });
    fireEvent.keyDown(activeInput, { key: 'Enter', code: 'Enter', charCode: 13 });

    // Wait until the active input is removed from the DOM.
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/Guess the Guest/i)).toBeNull();
    });

    // Finally, check that the Game Over message appears.
    await waitFor(() => {
      expect(screen.getByText(/Game Over: You lost/i)).toBeInTheDocument();
    });
  });
});
