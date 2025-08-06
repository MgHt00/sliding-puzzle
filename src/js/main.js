import '../lib/bootstrap.bundle.js';
import { startGame } from './components/loadingManager.js';
import { blackoutScreen, unBlackoutScreen } from './utils/domHelpers.js';

/**
 * Main function to initialize the puzzle.
 */
function init() {
  // Show the loading spinner and overlay.
  blackoutScreen();

  // Use setTimeout to yield to the browser's rendering engine.
  // This ensures the spinner is visible before the heavy work of startGame() begins.
  setTimeout(() => {
    startGame();
    unBlackoutScreen();
  }, 0);
}

init();
