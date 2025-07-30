import { SELECTORS } from '../services/selectors.js';
import { CSS_CLASSES } from '../constants/cssClassNames.js';

/**
 * Handles the click event on a puzzle tile.
 * For now, it just logs the clicked tile's content.
 * @param {Event} event - The click event object.
 */
function _handleTileClick(event) {
  const clickedTile = event.target;
  console.log('Tile clicked:', clickedTile.innerHTML);
  // Future logic for checking if the tile can move and then moving it will go here.
}

/**
 * Adds a click event listener to the puzzle board using event delegation.
 * This is more efficient than adding a listener to every single tile.
 */
export function addTileClickListeners() {
  console.info('Adding tile click listeners...');
  const board = SELECTORS.board();
  if (!board) {
    console.error('Puzzle board not found. Cannot add listeners.');
    return;
  }

  board.addEventListener('click', (event) => {
    // Ensure the clicked element is a tile and not the empty space
    if (event.target.classList.contains(CSS_CLASSES.TILE) && !event.target.classList.contains(CSS_CLASSES.EMPTY_TILE)) {
      _handleTileClick(event);
    }
  });
}
