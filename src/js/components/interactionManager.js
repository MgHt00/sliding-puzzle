import { SELECTORS } from '../services/selectors.js';
import { CSS_CLASSES } from '../constants/cssClassNames.js';
import { ALERT } from '../constants/appConstants.js';
import { isTileMovable, checkWinCondition, resetBoard } from '../utils/boardUtils.js';
import { swapTiles } from '../utils/animationUtils.js';
import { showAlert, hideAlert, hideWinningScreen, showConfirmationScreen, hideConfirmationScreen, isElementVisible } from '../utils/domHelpers.js';
import { fetchContentType, fetchGameInProgress, setGameInProgress } from '../services/globalDataManager.js';

let isAnimating = false;
// To store references to the event handlers for easy removal.
let _boundConfirmHandler = null;
let _boundCancelHandler = null;

/**
 * A helper function to add an event listener to an element, with a built-in check for the element's existence.
 * @param {function(): Element|null} selectorFn - A function that returns the DOM element.
 * @param {string} eventName - The name of the event to listen for (e.g., 'click').
 * @param {function(Event): void} eventHandler - The function to execute when the event is triggered.
 * @param {string} errorMessage - The error message to log if the element is not found.
 */
function _addEventListener(selectorFn, eventName, eventHandler, errorMessage) {
  const element = selectorFn();
  if (element) {
    element.addEventListener(eventName, eventHandler);
  } else {
    console.error(errorMessage);
  }
}

function _setAndShowWinAlert() {
  _boundConfirmHandler = () => {
    hideAlert();
    resetBoard();
  };

  const confirmBtn = SELECTORS.alertConfirmBtn();
  confirmBtn.addEventListener('click', _boundConfirmHandler);

  showAlert(ALERT.TYPE_WON);
  setGameInProgress(false);

}

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
        _setAndShowWinAlert();
      }
    });
  }
}

/**
 * Adds a click event listener to the puzzle board using event delegation.
 * This is more efficient than adding a listener to every single tile.
 */
function _addTileClickListeners() {
  _addEventListener(SELECTORS.board, 'click', (event) => {
    // Ensure the clicked element is a tile and not the empty space
    if (event.target.classList.contains(CSS_CLASSES.TILE) && !event.target.classList.contains(CSS_CLASSES.EMPTY_TILE)) {
      _handleTileClick(event);
    }
  }, 'Puzzle board not found. Cannot add listeners.');
}

function _addWinAlertCloseListener() {
  _addEventListener(SELECTORS.btnCloseWinAlert, 'click', () => {
    hideWinningScreen();
    resetBoard();
  }, 'Winning alert close button not found.');
}

function _setAndShowResetAlert() {
  showAlert(ALERT.TYPE_WARNING);
  const confirmBtn = SELECTORS.alertConfirmBtn();
  const cancelBtn = SELECTORS.alertCancelBtn();

  _boundConfirmHandler = () => {
    resetBoard();
    hideAlert();
  };

  _boundCancelHandler = () => {
    hideAlert();
  }

  confirmBtn.addEventListener('click', _boundConfirmHandler);
  cancelBtn.addEventListener('click', _boundCancelHandler);
}

function _addResetButtonListener() {
  _addEventListener(SELECTORS.btnReset, 'click', () => {
    if (fetchGameInProgress()) {
      //showConfirmationScreen();
      _setAndShowResetAlert();
      return;
    }
    resetBoard();
  }, 'Reset button not found.');
}

function _addConfirmationCancelListener() {
  _addEventListener(SELECTORS.btnAlertCancel, 'click', () => {
    hideConfirmationScreen();
  }, 'Confirmation alert cancel button not found.');
}

function _addConfirmationConfirmListener() {
  _addEventListener(SELECTORS.btnAlertConfirm, 'click', () => {
    hideConfirmationScreen();
    resetBoard();
  }, 'Confirmation alert confirm button not found.');
}

function _addGlobalKeyPressListener() {
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
      return;
    }

    if (isElementVisible(SELECTORS.alertWrapper()) && !fetchGameInProgress()) {
      hideAlert();
      SELECTORS.btnReset()?.blur();
      return;
    }

    if (isElementVisible(SELECTORS.confirmationAlert())) {
      hideConfirmationScreen();
      SELECTORS.btnReset()?.blur();
      return;
    }

    if (isElementVisible(SELECTORS.winningAlert())) {
      hideWinningScreen();
      resetBoard();
    }
  });
}

export function addAllClickListeners() {
  _addTileClickListeners();
  _addGlobalKeyPressListener();
  _addResetButtonListener();
  _addWinAlertCloseListener();
  _addConfirmationCancelListener();
  _addConfirmationConfirmListener();
}