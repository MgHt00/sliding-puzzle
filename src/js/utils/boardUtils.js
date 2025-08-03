import { SELECTORS } from '../services/selectors.js';
import { CSS_CUSTOM_PROPERTIES, CSS_CLASSES } from '../constants/cssClassNames.js';
import { generateRandomNumber, generateSequence } from './mathHelpers.js';

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
 * Gets the grid dimensions from CSS custom properties.
 * @returns {{columns: number, rows: number}}
 */
function _getGridDimensions() {
  const board = SELECTORS.board();
  if (!board) {
    console.error('Board element not found for getting dimensions.');
    return { columns: 0, rows: 0 };
  }
  const style = getComputedStyle(board);
  const columns = parseInt(style.getPropertyValue(CSS_CUSTOM_PROPERTIES.PUZZLE_BOARD_COLUMNS), 10) || 0;
  const rows = parseInt(style.getPropertyValue(CSS_CUSTOM_PROPERTIES.PUZZLE_BOARD_ROWS), 10) || 0;
  return { columns, rows };
}

/**
 * Sets the data-row and data-col attributes for each tile on the board.
 * This makes tile positions easily accessible without complex calculations.
 * @param {NodeListOf<Element>} tiles - The list of all puzzle tiles.
 * @param {number} columns - The number of columns in the puzzle grid.
 */
function _setTileCoordinates(tiles, columns) {
  console.info('Setting tile coordinates...');
  tiles.forEach((tile, index) => {
    tile.dataset.row = String(Math.floor(index / columns));
    tile.dataset.col = String(index % columns);
  });
}

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
 * Gets the row and column of a tile based on its index in the DOM.
 * This has been refactored to read from data attributes for better performance.
 * @param {Element} tile - The tile element.
 * @returns {{row: number, col: number}|null}
 */
function _getTileCoords(tile) {
  if (!tile || !tile.dataset.row || !tile.dataset.col) {
    console.warn('Tile is missing coordinate data attributes.', tile);
    return null;
  }

  // The dataset properties are strings, so they need to be parsed.
  const row = parseInt(tile.dataset.row, 10);
  const col = parseInt(tile.dataset.col, 10);

  return { row, col };
}

/**
 * Checks if a tile is adjacent to the empty tile, making it movable.
 * @param {Element} tile - The tile to check.
 * @param {Element} emptyTile - The empty tile.
 * @returns {boolean} - True if the tile is movable.
 */
export function isTileMovable(tile, emptyTile) {
  if (!tile || !emptyTile) return false;

  const tileCoords = _getTileCoords(tile);
  const emptyCoords = _getTileCoords(emptyTile);
  if (!tileCoords || !emptyCoords) return false;

  const rowDiff = Math.abs(tileCoords.row - emptyCoords.row);
  const colDiff = Math.abs(tileCoords.col - emptyCoords.col);

  // A tile is movable if it's in the same column and adjacent row,
  // or in the same row and adjacent column.
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

/**
 * Initializes the puzzle board by querying for tiles, designating an empty one,
 * generating the number sequence, and rendering the numbers onto the tiles.
 */
export function initializeBoard({ contentType = 'numbers' } = {}) {
  // The outer {} - "If this function is called with no arguments at all, then use an empty object {} as the argument."
  console.info('Initializing board...');
  const allTiles = SELECTORS.allTiles();
  const { columns, rows } = _getGridDimensions();
  const tileCount = allTiles.length;

  if (tileCount !== columns * rows) {
    console.error('Mismatch between tile count in HTML and grid dimensions in CSS.');
    return;
  }

  // Sets the data-row and data-col attributes
  _setTileCoordinates(allTiles, columns);

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

/**
 * Animates the swapping of a tile with the empty tile and returns a promise
 * that resolves when the animation is complete.
 * @param {object} params
 * @param {Element} params.sourceTile - The tile being moved.
 * @param {Element} params.targetTile - The empty tile to move into.
 * @returns {Promise<void>}
 */
export function swapTiles({ sourceTile, targetTile }) {
  return new Promise((resolve) => {
    console.info('Animating tile swap...');

    const sourceRect = sourceTile.getBoundingClientRect(); // LT01
    const targetRect = targetTile.getBoundingClientRect();

    const dx = targetRect.left - sourceRect.left;
    const dy = targetRect.top - sourceRect.top;

    // Apply transforms to trigger the CSS transition
    sourceTile.style.transform = `translate(${dx}px, ${dy}px)`;
    targetTile.style.transform = `translate(${-dx}px, ${-dy}px)`;

    // Listen for the end of the transition on the moving tile
    sourceTile.addEventListener('transitionend', () => {
      // Temporarily disable transitions to prevent a visual "snap-back"
      sourceTile.style.transition = 'none';
      targetTile.style.transition = 'none';

      // Force the browser to apply the 'transition: none' style change immediately.
      // Reading a property like offsetHeight triggers a reflow, ensuring the next lines are not animated.
      sourceTile.offsetHeight;

      // Reset transforms and perform the actual DOM update
      sourceTile.style.transform = '';
      targetTile.style.transform = '';
      targetTile.innerHTML = sourceTile.innerHTML;
      targetTile.classList.remove(CSS_CLASSES.EMPTY_TILE);
      sourceTile.innerHTML = '';
      sourceTile.classList.add(CSS_CLASSES.EMPTY_TILE);

      // Re-enable transitions for the next move and resolve the promise.
      // LT02: Using rAF ensures the browser has painted the final state before re-enabling transitions.
      requestAnimationFrame(() => {
        sourceTile.style.transition = '';
        targetTile.style.transition = '';
        resolve();
      });
    }, { once: true }); // automatically remove the event listener after it has been executed just one time
  });
}
