import { initializeBoard, initializeSolvedBoard, checkWinCondition } from '../utils/boardUtils.js';
import { addAllClickListeners } from './interactionManager.js';
import { fetchState } from '../services/globalDataManager.js';

/**
 * Manages the game's startup sequence.
 * This is the place to add logic for loading screens, asset preloading, etc.
 */
export function startGame() {
  console.log('Starting game...');
  // Future: Show a loading spinner or welcome screen here.

  // Check for a 'test=win' URL parameter to easily test the win condition.
  const urlParams = new URLSearchParams(window.location.search);
  const shouldTestWinCondition = urlParams.get('test') === 'win';

  if (shouldTestWinCondition) {
    // Initialize the board in a solved state for testing.
    const state = fetchState();
    initializeSolvedBoard({ contentType: state.contentType });

    // Immediately check if the win condition is met.
    if (checkWinCondition(state.contentType)) {
      console.log('✅ SUCCESS: checkWinCondition() correctly identified the solved board.');
    } else {
      console.error('❌ FAILURE: checkWinCondition() did not identify the solved board.');
    }
  } else {
    // Start a normal, randomized game.
    initializeBoard(fetchState());
  }

  // Once the board is set up, add the interaction listeners.
  addAllClickListeners();
}