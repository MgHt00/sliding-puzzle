import '../lib/bootstrap.bundle.js';
import { initializeBoard } from './utils/boardUtils.js';

/**
 * Main function to initialize the puzzle.
 */
function init() {
  console.log('Initializing puzzle...');
  initializeBoard();
}

init();
