import { SELECTORS } from '../services/selectors.js';
import { CSS_CLASSES } from '../constants/cssClassNames.js';
import { ALERT } from '../constants/appConstants.js';
import { isTileMovable, checkWinCondition, resetBoard } from '../utils/boardUtils.js';
import { swapTiles } from '../utils/animationUtils.js';
import { showAlert, hideAlert, isElementVisible } from '../utils/domHelpers.js';
import { showConfirmationAlert } from '../controllers/alertController.js';
import { fetchContentType, setContentType, fetchGameInProgress, setGameInProgress, fetchBoardSize, setBoardSize } from '../services/globalDataManager.js';

let _isAnimating = false;

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

/**
 * Synchronizes the settings UI (radio buttons) with the current application state.
 * This ensures the UI always reflects the true state, preventing inconsistencies.
 */
function _syncSettingsUI() {
  // Sync content type radio buttons
  const currentContentType = fetchContentType();
  const contentTypeRadio = document.querySelector(`.${CSS_CLASSES.SETTING_CONTENT_TYPE}[value="${currentContentType}"]`);
  if (contentTypeRadio) {
    contentTypeRadio.checked = true;
  } else {
    console.error(`Could not find a setting radio button for content type: ${currentContentType}`);
  }

  // Sync board size radio buttons
  const currentBoardSize = fetchBoardSize();
  const boardSizeRadio = document.querySelector(`.${CSS_CLASSES.SETTING_BOARD_SIZE}[value="${currentBoardSize}"]`);
  if (boardSizeRadio) {
    boardSizeRadio.checked = true;
  } else {
    // This might happen on first load if the default size isn't an option in the HTML, which is fine.
    console.warn(`Could not find a setting radio button for board size: ${currentBoardSize}`);
  }
}

function _setAndShowWinAlert() {
  const confirmBtn = SELECTORS.alertConfirmBtn();
  if (!confirmBtn) return;

  const handleConfirm = () => {
    hideAlert();
    resetBoard();
    confirmBtn.removeEventListener('click', handleConfirm);
  };

  setGameInProgress(false);
  showAlert(ALERT.TYPE_WON);

  // Use { once: true } for safety, though we also manually remove it.
  confirmBtn.addEventListener('click', handleConfirm, { once: true });
}

/**
 * Closes the settings offcanvas panel using the Bootstrap JavaScript API.
 */
function _closeSettingsPanel() {
  const settingsPanel = SELECTORS.offcanvasPanel();
  if (!settingsPanel) {
    console.error('Settings panel element not found.');
    return;
  }

  const offcanvasInstance = bootstrap.Offcanvas.getInstance(settingsPanel);
  offcanvasInstance?.hide();
}

/**
 * Handles the click event on a puzzle tile.
 * Checks if the tile is movable and initiates the swap if it is.
 * @param {Event} event - The click event object.
 */
function _handleTileClick(event) {
  if (_isAnimating) {
    console.warn('Animation in progress, please wait.');
    return;
  }

  const clickedTile = event.target;
  const emptyTile = SELECTORS.emptyTile();

  if (isTileMovable(clickedTile, emptyTile)) {
    console.log('Tile is movable, swapping...');
    setGameInProgress(true);
    _isAnimating = true;
    swapTiles({ sourceTile: clickedTile, targetTile: emptyTile }).then(() => {
      _isAnimating = false;
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

function _addResetButtonListener() {
  _addEventListener(SELECTORS.btnReset, 'click', async () => {
    if (fetchGameInProgress()) {
      const confirmed = await showConfirmationAlert();
      if (confirmed) {
        resetBoard();
      }
    } else {
      // If no game is in progress, reset immediately without confirmation.
      resetBoard();
    }
  }, 'Reset button not found.');
}

async function _handleContentTypeChange(event) {
  const newContentType = event.target.value;
  const currentContentType = fetchContentType();

  // Only proceed if the content type has actually changed.
  if (!newContentType || newContentType === currentContentType) {
    return;
  }

  _closeSettingsPanel();

  if (fetchGameInProgress()) {
    const confirmed = await showConfirmationAlert();
    if (confirmed) {
      setContentType(newContentType);
      resetBoard();
    } else {
      _syncSettingsUI(); // User canceled, so sync UI back to the original state.
    }
  } else {
    console.warn('Game is not in progress. Resetting board with', newContentType);
    setContentType(newContentType);
    resetBoard();
  }
}

async function _handleBoardSizeChange(event) {
  const newBoardSize = parseInt(event.target.value, 10);
  const currentBoardSize = fetchBoardSize();

  if (!newBoardSize || newBoardSize === currentBoardSize) {
    return;
  }

  _closeSettingsPanel();

  if (fetchGameInProgress()) {
    const confirmed = await showConfirmationAlert();
    if (confirmed) {
      setBoardSize(newBoardSize);
      resetBoard();
    } else {
      _syncSettingsUI(); // User canceled, so sync UI back to the original state.
    }
  } else {
    console.warn('Game is not in progress. Resetting board with new size', newBoardSize);
    setBoardSize(newBoardSize);
    resetBoard();
  }
}

/**
 * A map of setting classes to their corresponding change handler functions.
 * This creates a scalable, data-driven way to handle setting changes.
 */
const settingHandlers = {
  [CSS_CLASSES.SETTING_BOARD_SIZE]: _handleBoardSizeChange,
  [CSS_CLASSES.SETTING_CONTENT_TYPE]: _handleContentTypeChange,
};

/**
 * Handles a change event on any setting within the offcanvas panel.
 * It uses the settingHandlers map to delegate to the correct function.
 * @param {Event} event - The event object from the change event.
 */
async function _handleSettingChange(event) {
  const target = event.target;
  // Find the handler that corresponds to a class on the event target.
  for (const [className, handler] of Object.entries(settingHandlers)) {
    if (target.classList.contains(className)) {
      // Execute the handler and stop searching.
      await handler(event);
      return;
    }
  }
}

function _addOffcanvasListeners() {
  const offcanvasPanel = SELECTORS.offcanvasPanel();
  if (!offcanvasPanel) return;

  offcanvasPanel.addEventListener('show.bs.offcanvas', _syncSettingsUI);
  offcanvasPanel.addEventListener('change', _handleSettingChange);
}

function _addGlobalKeyPressListener() {
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
      return;
    }

    // The confirmation (reset) alert is now handled by alertController,
    // which listens for 'Escape' automatically. We only need to handle the 'win' alert.
    if (isElementVisible(SELECTORS.alertWrapper()) && !fetchGameInProgress()) {
      // The win alert only has a confirm button, so we can just "click" it.
      SELECTORS.alertConfirmBtn()?.click();
      SELECTORS.btnReset()?.blur();
      return;
    }
  });
}

export function addAllClickListeners() {
  _addTileClickListeners();
  _addGlobalKeyPressListener();
  _addResetButtonListener();
  _addOffcanvasListeners();
}