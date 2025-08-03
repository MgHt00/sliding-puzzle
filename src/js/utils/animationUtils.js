import { CSS_CLASSES } from '../constants/cssClassNames.js';

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
    sourceTile.addEventListener('transitionend', () => { // automatically remove the event listener after it has been executed just one time
      // By nesting requestAnimationFrames, we ensure each step happens on a separate
      // rendering frame, giving the browser time to process the style changes
      // and preventing the "snap-back" animation glitch.

      // Frame 1: Disable transitions.
      requestAnimationFrame(() => {
        sourceTile.style.transition = 'none';
        targetTile.style.transition = 'none';

        // Frame 2: Perform the DOM swap and reset the transforms.
        // This happens on the next frame, after the browser has processed 'transition: none'.
        requestAnimationFrame(() => {
          // Perform the actual DOM update
          targetTile.innerHTML = sourceTile.innerHTML;
          targetTile.classList.remove(CSS_CLASSES.EMPTY_TILE);
          sourceTile.innerHTML = '';
          sourceTile.classList.add(CSS_CLASSES.EMPTY_TILE);

          // Reset the transforms now that transitions are disabled.
          sourceTile.style.transform = '';
          targetTile.style.transform = '';

          // Frame 3: Re-enable transitions for the next move and resolve the promise.
          requestAnimationFrame(() => {
            sourceTile.style.transition = '';
            targetTile.style.transition = '';
            resolve();
          });
        });
      });
    }, { once: true });
  });
}

