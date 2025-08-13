import { SELECTORS } from "../services/selectors.js";
import { CSS_CLASSES } from "../constants/cssClassNames.js";
import { ALERT } from "../constants/appConstants.js";

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

const _classMap = {
  [ALERT.TYPE_WARNING]: CSS_CLASSES.WARNING,
};

function _resetAlertBox() {
  const alertWrapper = SELECTORS.alertWrapper();  
  const alertHeading = SELECTORS.alertHeading();
  const alertText = SELECTORS.alertText();
  const alertCancelBtn = SELECTORS.alertCancelBtn();

  // To ensure a clean state, remove any alert-type-specific classes.
  Object.values(_classMap).forEach(className => alertWrapper.classList.remove(className));
  
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

function _setAlertAppearance(alertType) {
  const alertWrapper = SELECTORS.alertWrapper();
  const classToAdd = _classMap[alertType];
  if (alertWrapper && classToAdd) {
    alertWrapper.classList.add(classToAdd);
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

const alertContentMap = {
  [ALERT.TYPE_WON]: {
    heading: ALERT.WON_HEADER,
    text: ALERT.WON_TEXT,
    includeCancel: false,
    confirmText: ALERT.BTN_CONFIRM,
    cancelText: '',
    alertType: ALERT.TYPE_DEFAULT,
  },

  [ALERT.TYPE_WARNING]: {
    heading: ALERT.WARN_HEADER,
    text: ALERT.WARN_TEXT,
    includeCancel: true,
    confirmText: ALERT.BTN_CONFIRM,
    cancelText: ALERT.BTN_CANCEL,
    alertType: ALERT.TYPE_WARNING,
  }
}

export function showAlert(type) {
  if (!type) {
    console.error('No alert type provided.');
    return;
  }

  const config = alertContentMap[type];
  if (!config) {
    console.error(`Unknown alert type: ${type}`);
    return;
  }

  const { heading, text, includeCancel, confirmText, cancelText, alertType } = config;

  _resetAlertBox();
  _showOverlay();
  _setAlertContent(heading, text, confirmText, cancelText);
  _setAlertAppearance(alertType);
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