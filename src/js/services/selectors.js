import { CSS_CLASSES } from '../constants/cssClassNames.js';

export const SELECTORS = {
  board: () => document.querySelector(`.${CSS_CLASSES.BOARD}`),
  allTiles: () => document.querySelectorAll(`.${CSS_CLASSES.TILE}`),
  emptyTile: () => document.querySelector(`.${CSS_CLASSES.EMPTY_TILE}`),
  
  overlay: () => document.querySelector(`.${CSS_CLASSES.OVERLAY}`),
  loadingSpinner: () => document.querySelector(`.${CSS_CLASSES.LOADING_SPINNER}`),
  
  btnReset: () => document.querySelector(`.${CSS_CLASSES.BTN_RESET}`),

  alertWrapper: () => document.querySelector(`.${CSS_CLASSES.WRAPPER_ALERT}`),
  alertHeading: () => document.querySelector(`.${CSS_CLASSES.CONTENT_ALERT_HEADING}`),
  alertText: () => document.querySelector(`.${CSS_CLASSES.CONTENT_ALERT_TEXT}`),
  alertConfirmBtn: () => document.querySelector(`.${CSS_CLASSES.BTN_ALERT_CONFIRM}`),
  alertCancelBtn: () => document.querySelector(`.${CSS_CLASSES.BTN_ALERT_CANCEL}`),

  offcanvasPanel: () => document.querySelector(`.${CSS_CLASSES.OFFCANVAS_PANEL}`),
  settingContentType: () => document.querySelector(`.${CSS_CLASSES.SETTING_CONTENT_TYPE}`),
  settingArabic: () => document.querySelector(`.${CSS_CLASSES.SETTING_ARABIC}`),
  settingJapanese: () => document.querySelector(`.${CSS_CLASSES.SETTING_JAPANESE}`),
};