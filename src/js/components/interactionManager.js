import { SELECTORS } from '../services/selectors.js';
import { CSS_CLASSES } from '../constants/cssClassNames.js';
import { isTileMovable, checkWinCondition, resetBoard } from '../utils/boardUtils.js';
import { swapTiles } from '../utils/animationUtils.js';
import { showWinningScreen, hideWinningScreen, showConfirmationScreen, hideConfirmationScreen } from '../utils/domHelpers.js';
import { fetchContentType, fetchGameInProgress, setGameInProgress } from '../services/globalDataManager.js';

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
    setGameInProgress(true);
    isAnimating = true;
    swapTiles({ sourceTile: clickedTile, targetTile: emptyTile }).then(() => {
      isAnimating = false;
      // After the animation, check if the player has won.
      if (checkWinCondition(fetchContentType())) {
        //console.info("✅ SUCCESS: Player has won!")
        showWinningScreen();
        setGameInProgress(false);
      }
    });
  }
}

/**
 * Adds a click event listener to the puzzle board using event delegation.
 * This is more efficient than adding a listener to every single tile.
 */
function _addTileClickListeners() {
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

function _addWinAlertCloseListener() {
  const btnCloseAlert = SELECTORS.btnCloseWinAlert();
  if (!btnCloseAlert) {
    console.error('Winning alert close button not found.');
    return;
  }

  btnCloseAlert.addEventListener('click', () => {
    hideWinningScreen();
    resetBoard();
  });
}

function _addResetButtonListener() {
  const btnReset = SELECTORS.btnReset();
  if (!btnReset) {
    console.error('Reset button not found.');
    return;
  }

  btnReset.addEventListener('click', () => {
    if (fetchGameInProgress()) {
      showConfirmationScreen();
      return;
    }
    hideConfirmationScreen()
    resetBoard();
  });
}

function _addConfirmationCancelListener() {
  const btnCancel = SELECTORS.btnAlertCancel();
  if (!btnCancel) {
    console.error('Confirmation alert cancel button not found.');
    return;
  }

  btnCancel.addEventListener('click', () => {
    hideConfirmationScreen();
  });
}

function _addConfirmationConfirmListener() {
  const btnConfirm = SELECTORS.btnAlertConfirm();
  if (!btnConfirm) {
    console.error('Confirmation alert confirm button not found.');
    return;
  }

  btnConfirm.addEventListener('click', () => {
    hideConfirmationScreen();
    resetBoard();
  });
}

export function addAllClickListeners() {
  _addTileClickListeners();
  _addResetButtonListener()
  _addWinAlertCloseListener();
  _addConfirmationCancelListener();
  _addConfirmationConfirmListener();
}