import { SELECTORS } from '../services/selectors.js';
import { CSS_CLASSES } from '../constants/cssClassNames.js';
import { swapTiles, isTileMovable } from '../utils/boardUtils.js';

let isAnimating = false;

/**
 * Handles the click event on a puzzle tile.
 * Checks if the tile is movable and initiates the swap if it is.
 * @param {Event} event - The click event object.
 */
function _handleTileClick(event) {
  if (isAnimating) {
    console.warn('Animation in progress, please wait.');
    return;
  }

  const clickedTile = event.target;
  const emptyTile = SELECTORS.emptyTile();

  if (isTileMovable(clickedTile, emptyTile)) {
    console.log('Tile is movable, swapping...');
    isAnimating = true;
    swapTiles({ sourceTile: clickedTile, targetTile: emptyTile }).then(() => {
      isAnimating = false;
      // Future: Check for win condition here.
    });
  }
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
