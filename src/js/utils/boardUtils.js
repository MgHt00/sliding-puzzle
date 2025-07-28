import { SELECTORS } from '../services/selectors.js';

/**
 * Populates the puzzle board with numbers.
 * It assumes the tiles are in document order and the last one is the empty tile.
 */
export function initializeBoard() {
  console.info("Initializing board...")
  const tiles = SELECTORS.allTiles();
  const tileCount = tiles.length;

  // Assign numbers 1 to (tileCount - 1) to the tiles
  for (let i = 0; i < tileCount - 1; i++) {
    tiles[i].textContent = i + 1;
  }
}
