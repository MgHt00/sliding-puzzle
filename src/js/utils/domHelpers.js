import { SELECTORS } from "../services/selectors.js";
import { CSS_CLASSES } from "../constants/cssClassNames.js";

function _showOverlay() {
  const overlay = SELECTORS.overlay();
  if (overlay) {
    overlay.classList.remove(CSS_CLASSES.D_NONE);
  }
}

function _hideOverlay() {
  const overlay = SELECTORS.overlay();
  if (overlay) {
    overlay.classList.add(CSS_CLASSES.D_NONE);
  }
}

function _showLoadingSpinner() {
  const loadingSpinner = SELECTORS.loadingSpinner();
  if (loadingSpinner) {
    loadingSpinner.classList.remove(CSS_CLASSES.D_NONE);
  }
}

function _hideLoadingSpinner() {
  const loadingSpinner = SELECTORS.loadingSpinner();
  if (loadingSpinner) {
    loadingSpinner.classList.add(CSS_CLASSES.D_NONE);
  }
}

export function blackoutScreen() {
  _showOverlay();
  _showLoadingSpinner();
}

export function unBlackoutScreen() {
  _hideOverlay();
  _hideLoadingSpinner();
}