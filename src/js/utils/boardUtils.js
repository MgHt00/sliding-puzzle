import { SELECTORS } from '../services/selectors.js';
import { CSS_CUSTOM_PROPERTIES, CSS_CLASSES } from '../constants/cssClassNames.js';
import { CONTENT_TYPES, STATE_KEYS } from '../constants/appConstants.js';
import { fetchState, fetchGameInProgress } from '../services/globalDataManager.js';
import { generateRandomNumber, generateSequence } from './mathHelpers.js';
import { isWinTestMode } from './urlUtils.js';

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

function _removeEmptyTile() {
  console.info('Removing empty tile...');
  const emptyTile = SELECTORS.emptyTile();
  if (emptyTile) {
    emptyTile.classList.remove(CSS_CLASSES.EMPTY_TILE);
  } else {
    console.error('Empty tile not found.');
  }
}

function _removeTileContent() {
  console.info('Removing tile content...');
  const allTiles = SELECTORS.allTiles();
  allTiles.forEach((tile) => {
    tile.innerHTML = '';
  });
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
export function initializeBoard({ contentType = CONTENT_TYPES.DEFAULT, random = CONTENT_TYPES.RANDOM } = {}) {
  // LT03 The outer {} - "If this function is called with no arguments at all, then use an empty object {} as the argument."
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
    case CONTENT_TYPES.ARABIC_NUMBERS: {
      const numbers = generateSequence({ min: 1, max: tileCount, inclusive: false, random });
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

export function resetBoard() {
  console.warn('Resetting board...');
  const state = fetchState();
  _removeEmptyTile();
  _removeTileContent();

  // Check if we are in test mode to initialize the appropriate board state.
  if (isWinTestMode()) {
    initializeSolvedBoard(state);
  } else {
    initializeBoard(state);
  }
}

/**
 * Initializes the puzzle board in a solved state for testing purposes.
 * The empty tile is placed at the end and numbers are in sequential order.
 * @param {object} [options={}] - The options for initializing the board.
 * @param {string} [options.contentType=CONTENT_TYPES.DEFAULT] - The type of content to render.
 */
export function initializeSolvedBoard({ contentType = CONTENT_TYPES.DEFAULT } = {}) {
  console.info('Initializing solved board for testing...');
  const allTiles = SELECTORS.allTiles();
  const { columns, rows } = _getGridDimensions();
  const tileCount = allTiles.length;

  if (tileCount !== columns * rows) {
    console.error('Mismatch between tile count in HTML and grid dimensions in CSS.');
    return;
  }

  // Sets the data-row and data-col attributes
  _setTileCoordinates(allTiles, columns);

  // For a solved state, the empty tile MUST be the last one.
  allTiles[tileCount - 1].classList.add(CSS_CLASSES.EMPTY_TILE);

  // Filter out the newly created empty tile to get the list of tiles to render numbers on.
  const tilesToRenderOn = Array.from(allTiles).filter(
    (tile) => !tile.classList.contains(CSS_CLASSES.EMPTY_TILE)
  );

  switch (contentType) {
    case CONTENT_TYPES.ARABIC_NUMBERS: {
      // For a solved state, the sequence MUST NOT be random.
      const numbers = generateSequence({ min: 1, max: tileCount, inclusive: false, random: false });
      _renderBoard(tilesToRenderOn, numbers);
      break;
    }
    default:
      console.error(`Unknown content type: ${contentType}`);
  }
}

/**
 * Checks if the tiles are in the correct Arabic numeral sequence (1, 2, 3, ...).
 * @param {Array<Element>} allTiles - The array of all tile elements.
 * @returns {boolean} - True if the sequence is correct.
 */
function _isArabicSequence(allTiles) {
  // Iterate through all but the last tile to check for sequential order.
  for (let i = 0; i < allTiles.length - 1; i++) {
    const tile = allTiles[i];
    const tileNumber = parseInt(tile.innerHTML, 10);
    // The tile's content (number) should match its position in the grid (index + 1).
    if (tileNumber !== i + 1) {
      return false; // Found a tile out of order.
    }
  }
  return true; // All tiles are in the correct order.
}

/**
 * Checks if the puzzle is in its winning state.
 * The win condition is met when all tiles are in sequential order (1, 2, 3, ...)
 * and the last position is occupied by the empty tile.
 * @returns {boolean} - True if the win condition is met.
 * @param {string} contentType - The content type to check against (e.g., 'arabic-numbers').
 */
export function checkWinCondition(contentType) {
  console.info('Checking win condition...');
  const allTiles = Array.from(SELECTORS.allTiles());

  // The win condition requires the last tile to be the empty one.
  const lastTile = allTiles[allTiles.length - 1];
  if (!lastTile.classList.contains(CSS_CLASSES.EMPTY_TILE)) {
    return false;
  }

  switch (contentType) {
    case CONTENT_TYPES.ARABIC_NUMBERS:
      return _isArabicSequence(allTiles);
    // case CONTENT_TYPES.JAPANESE_NUMBERS:
    //   return _isJapaneseSequence(allTiles);
    default:
      console.error(`Win condition check not implemented for content type: ${contentType}`);
      return false;
  }
}