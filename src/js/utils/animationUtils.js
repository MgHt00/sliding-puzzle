import { CSS_CLASSES } from '../constants/cssClassNames.js';

/**
 * Swaps the content and classes between two tiles after the animation.
 * @param {Element} sourceTile - The tile that was moved (becomes the new empty tile).
 * @param {Element} targetTile - The tile that was empty (receives the content).
 */
function _swapTileProperties(sourceTile, targetTile) {
  targetTile.innerHTML = sourceTile.innerHTML;
  targetTile.classList.remove(CSS_CLASSES.EMPTY_TILE);
  sourceTile.innerHTML = '';
  sourceTile.classList.add(CSS_CLASSES.EMPTY_TILE);
}

/**
 * Returns a promise that resolves on the next animation frame.
 * This is a modern alternative to using nested callbacks with `requestAnimationFrame`.
 * @returns {Promise<void>}
 */
function _waitForFrame() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}

/**
 * Finalizes the tile swap after the animation, handling DOM updates and style resets.
 * This async function uses a sequence of `await _waitForFrame()` calls
 * to ensure the browser has time to process each step, preventing visual glitches.
 * @param {Element} sourceTile - The tile that was moved.
 * @param {Element} targetTile - The tile that was empty.
 */
async function _finalizeSwap(sourceTile, targetTile) {
  // Frame 1: Wait for a frame, then disable transitions.
  await _waitForFrame();
  sourceTile.style.transition = 'none';
  targetTile.style.transition = 'none';

  // Frame 2: Wait for the next frame, then swap properties and reset transforms.
  await _waitForFrame();
  _swapTileProperties(sourceTile, targetTile);
  sourceTile.style.transform = '';
  targetTile.style.transform = '';

  // Frame 3: Wait again, then re-enable transitions and restore styles.
  await _waitForFrame();
  targetTile.style.pointerEvents = ''; // Re-enable hover effects.
  sourceTile.style.transition = '';
  targetTile.style.transition = '';
  targetTile.style.boxShadow = ''; // Restore shadow on the now-filled tile.

  // Use a minimal timeout to ensure the browser has processed the transition re-enabling
  // before we restore the shadow, allowing it to fade in smoothly.
  setTimeout(() => {
    sourceTile.style.boxShadow = ''; // Restore shadow on the new empty tile.
  }, 0);
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

    // --- PRE-ANIMATION SETUP ---

    // 1. Temporarily disable pointer events on the source tile. This is the
    // most reliable way to prevent its :hover state from interfering with
    // the slide animation and causing a "swinging" effect.
    sourceTile.style.pointerEvents = 'none';

    // 2. Temporarily remove the empty tile's shadow to prevent it from sliding.
    targetTile.style.boxShadow = 'none';

    // 3. Neutralize any active hover effects on the source tile. We explicitly
    // set the transform to 'none' to override the hover state's `translateY`.
    sourceTile.style.transform = 'none';

    // --- START ANIMATION ---

    // 4. Use rAF to ensure the browser has processed the transform reset
    // before we calculate the tile positions.
    requestAnimationFrame(() => {
      const sourceRect = sourceTile.getBoundingClientRect();
      const targetRect = targetTile.getBoundingClientRect();
      const dx = targetRect.left - sourceRect.left;
      const dy = targetRect.top - sourceRect.top;

      // 5. Apply the calculated transforms to trigger the CSS transition.
      sourceTile.style.transform = `translate(${dx}px, ${dy}px)`;
      targetTile.style.transform = `translate(${-dx}px, ${-dy}px)`;

      // 6. Once the animation is done, finalize the swap.
      sourceTile.addEventListener('transitionend', async () => {
        await _finalizeSwap(sourceTile, targetTile);
        resolve();
      }, { once: true });
    });
  });
}
