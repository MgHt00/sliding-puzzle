import { initializeBoard, checkWinCondition } from '../utils/boardUtils.js';
import { addAllClickListeners } from './interactionManager.js';
import { isWinTestMode } from '../utils/urlUtils.js';
import { fetchState } from '../services/globalDataManager.js';
import { STATE_KEYS } from '../constants/appConstants.js';

/**
 * Manages the game's startup sequence.
 * This is the place to add logic for loading screens, asset preloading, etc.
 */
export function startGame() {
  console.log('Starting game...');
  // Future: Show a loading spinner or welcome screen here.

  const state = fetchState();

  // Check if we are in test mode to initialize the appropriate board state.
  if (isWinTestMode()) {
    // For test mode, we want a non-random board.
    initializeBoard({ ...state, [STATE_KEYS.RANDOM]: false });

    // Immediately check if the win condition is met.
    if (checkWinCondition(state.contentType)) {
      console.log('✅ SUCCESS: checkWinCondition() correctly identified the solved board.');
    } else {
      console.error('❌ FAILURE: checkWinCondition() did not identify the solved board.');
    }
  } else {
    // Start a normal, randomized game.
    initializeBoard(state);
  }

  // Once the board is set up, add the interaction listeners.
  addAllClickListeners();
}