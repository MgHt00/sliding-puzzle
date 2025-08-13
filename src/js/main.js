import '../lib/bootstrap.bundle.js';
import { startGame } from './components/loadingManager.js'; 
import { showLoadingScreen, hideLoadingScreen } from './utils/domHelpers.js'; 
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
