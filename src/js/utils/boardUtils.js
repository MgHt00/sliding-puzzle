import { SELECTORS } from '../services/selectors.js';
import { CSS_CLASSES } from '../constants/cssClassNames.js';
import { generateSequence } from './mathHelpers.js';

/**
 * Renders the provided content onto the puzzle tiles.
 * This function is flexible and can render numbers, text, or HTML elements.
 * @param {Array<string|number>} content - An array of content to display on the tiles.
 */
function _renderBoard(content) {
  console.info('Rendering board content...');
  const tiles = Array.from(SELECTORS.allTiles()).filter(
    (tile) => !tile.classList.contains(CSS_CLASSES.EMPTY_TILE)
  );

  if (content.length !== tiles.length) {
    console.error("Content array length doesn't match the number of non-empty tiles.");
    return;
  }

  tiles.forEach((tile, index) => {
    tile.innerHTML = String(content[index]);
  });
}

/**
 * Populates the puzzle board with numbers.
 */
export function initializeBoard() {
  console.info('Initializing board...');
  const tileCount = SELECTORS.allTiles().length;
  console.info(`Tile count: ${tileCount}`);

  const numbers = generateSequence({min: 1, max: tileCount, inclusive: false});
  _renderBoard(numbers);
}
