import { initializeBoard } from '../utils/boardUtils.js';
import { addTileClickListeners } from './interactionManager.js';
import { globals } from '../services/globals.js';
import { STATE_KEYS } from '../constants/appConstants.js';


/**
 * Manages the game's startup sequence.
 * This is the place to add logic for loading screens, asset preloading, etc.
 */
export function startGame() {
  console.log('Starting game...');
  // Future: Show a loading spinner or welcome screen here.

  /*initializeBoard({ contentType: 'numbers' });*/
  initializeBoard({ contentType: globals.state[STATE_KEYS.CONTENT_TYPE] });

  // Once the board is set up, add the interaction listeners.
  addTileClickListeners();
}