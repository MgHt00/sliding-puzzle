import '../lib/bootstrap.bundle.js';
import { startGame } from './components/loadingManager.js'; // eslint-disable-line no-unused-vars
import { showLoadingScreen, hideLoadingScreen, showConfirmationScreen } from './utils/domHelpers.js'; // eslint-disable-line no-unused-vars

/**
 * Main function to initialize the puzzle.
 */
function init() {
  showLoadingScreen();
  setTimeout(() => {
    startGame();
    hideLoadingScreen();
  }, 0);
}

init();
