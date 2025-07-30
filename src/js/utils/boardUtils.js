import { SELECTORS } from '../services/selectors.js';
import { CSS_CLASSES } from '../constants/cssClassNames.js';
import { generateRandomNumber, generateSequence } from './mathHelpers.js';

/**
 * Selects a random tile and marks it as the empty tile.
 * @param {NodeListOf<Element>} tiles - The list of all puzzle tiles.
 */
function _addEmptyTile(tiles) {
  console.info('Adding empty tile...');
  const tileCount = tiles.length;
  const randomIndex = generateRandomNumber(0, tileCount - 1);
  tiles[randomIndex].classList.add(CSS_CLASSES.EMPTY_TILE);
}

/**
 * Renders the provided content onto the puzzle tiles.
 * This function is flexible and can render numbers, text, or HTML elements.
 * @param {Array<Element>} tilesToRenderOn - The tile elements to render content on.
 * @param {Array<string|number>} content - An array of content to display on the tiles.
 */
function _renderBoard(tilesToRenderOn, content) {
  console.info('Rendering board content...');
  if (content.length !== tilesToRenderOn.length) {
    console.error("Content array length doesn't match the number of non-empty tiles.");
    return;
  }

  tilesToRenderOn.forEach((tile, index) => {
    tile.innerHTML = String(content[index]);
  });
}

/**
 * Initializes the puzzle board by querying for tiles, designating an empty one,
 * generating the number sequence, and rendering the numbers onto the tiles.
 */
export function initializeBoard({ contentType = 'numbers' } = {}) {
  // The outer {} - "If this function is called with no arguments at all, then use an empty object {} as the argument."
  console.info('Initializing board...');
  const allTiles = SELECTORS.allTiles();
  const tileCount = allTiles.length;

  // Designate one tile as the empty one
  _addEmptyTile(allTiles);

  // Filter out the newly created empty tile to get the list of tiles to render numbers on.
  const tilesToRenderOn = Array.from(allTiles).filter(
    (tile) => !tile.classList.contains(CSS_CLASSES.EMPTY_TILE)
  );

  switch (contentType) {
    case 'numbers': {
      const numbers = generateSequence({ min: 1, max: tileCount, inclusive: false });
      _renderBoard(tilesToRenderOn, numbers);
      break;
    }
    // More cases here in the future
    // case 'photos':
    //   _renderPhotoBoard(tilesToRenderOn);
    //   break;
    default:
      console.error(`Unknown content type: ${contentType}`);
  }
}
