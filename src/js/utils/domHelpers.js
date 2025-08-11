import { SELECTORS } from "../services/selectors.js";
import { CSS_CLASSES } from "../constants/cssClassNames.js";

/**
 * Checks if an element is visible by checking for the absence of the 'd-none' class.
 * @param {Element|null} element - The element to check.
 * @returns {boolean} - True if the element is visible.
 */
export function isElementVisible(element) {
  return element ? !element.classList.contains(CSS_CLASSES.D_NONE) : false;
}

function _showElement(element) {
  if (element) {
    element.classList.remove(CSS_CLASSES.D_NONE);
  } else {
    console.error('Element not found for showing.');
  }
}

function _hideElement(element) {
  if (element) {
    element.classList.add(CSS_CLASSES.D_NONE);
  } else {
    console.error('Element not found for hiding.');
  }
}

function _showOverlay() {
  const overlay = SELECTORS.overlay();
  _showElement(overlay);
}

function _hideOverlay() {
  const overlay = SELECTORS.overlay();
  _hideElement(overlay);
}

function _showLoadingSpinner() {
  const loadingSpinner = SELECTORS.loadingSpinner();
  _showElement(loadingSpinner);
}

function _hideLoadingSpinner() {
  const loadingSpinner = SELECTORS.loadingSpinner();
  _hideElement(loadingSpinner);
}

function _showWinningAlert() {
  const winningAlert = SELECTORS.winningAlert();
  _showElement(winningAlert);
}

function _hideWinningAlert() {
  const winningAlert = SELECTORS.winningAlert();
  _hideElement(winningAlert);
}

function _showConfirmationAlert() {
  const confirmationAlert = SELECTORS.confirmationAlert();
  _showElement(confirmationAlert);
}

function _hideConfirmationAlert() {
  const confirmationAlert = SELECTORS.confirmationAlert();
  _hideElement(confirmationAlert);
}

function _resetAlertBox() {
  const alertWrapper = SELECTORS.alertWrapper();  
  const alertHeading = SELECTORS.alertHeading();
  const alertText = SELECTORS.alertText();
  const alertCancelBtn = SELECTORS.alertCancelBtn();

  alertWrapper.classList.remove(CSS_CLASSES.ERROR);
  
  alertHeading.innerHTML = '';
  alertText.innerHTML = '';
  
  _showElement(alertCancelBtn);
  
}

function _setAlertContent(heading, text, confirmText, cancelText) {
  const alertHeading = SELECTORS.alertHeading();
  const alertText = SELECTORS.alertText();
  const alertConfirmBtn = SELECTORS.alertConfirmBtn();
  const alertCancelBtn = SELECTORS.alertCancelBtn();
  
  alertHeading.innerHTML = heading;
  alertText.innerHTML = text;
  alertConfirmBtn.innerHTML = confirmText;
  alertCancelBtn.innerHTML = cancelText;
}

function _changeAlertBorderColor({type = 'default'} = {}) {
  const alertWrapper = SELECTORS.alertWrapper();

  switch (type) {
    case 'error':
      alertWrapper.classList.add(CSS_CLASSES.ERROR);
      break;
    
    default:
      break;
  }
}

function _showAlertWrapper() {
  const alertWrapper = SELECTORS.alertWrapper();
  _showElement(alertWrapper);
}

function _hideAlertWrapper() {
  const alertWrapper = SELECTORS.alertWrapper();
  _hideElement(alertWrapper);
}

function _hideAlertCancelBtn() {
  const alertCancelBtn = SELECTORS.alertCancelBtn();
  _hideElement(alertCancelBtn);
}

export function showLoadingScreen() {
  _showOverlay();
  _showLoadingSpinner();
}

export function hideLoadingScreen() {
  _hideOverlay();
  _hideLoadingSpinner();
}

export function showWinningScreen() {
  _showOverlay();
  _showWinningAlert();
}

export function hideWinningScreen() {
  _hideWinningAlert();
  _hideOverlay();
}

export function showConfirmationScreen() {
  _showOverlay();
  _showConfirmationAlert();
}

export function hideConfirmationScreen() {
  _hideConfirmationAlert();
  _hideOverlay();
}

export function showAlert({heading = '', text = '', includeCancel = true, confirmText = 'OK', cancelText = 'Cancel', alertType = 'default'} = {}) {
  _showOverlay();
  _setAlertContent(heading, text, confirmText, cancelText);
  if (!includeCancel) {
    _hideAlertCancelBtn();
  }
  _showAlertWrapper();
}

export function hideAlert() {
  _hideAlertWrapper();
  _resetAlertBox();
  _hideOverlay();
}