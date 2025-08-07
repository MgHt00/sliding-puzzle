import { CSS_CLASSES } from '../constants/cssClassNames.js';

export const SELECTORS = {
  board: () => document.querySelector(`.${CSS_CLASSES.BOARD}`),
  allTiles: () => document.querySelectorAll(`.${CSS_CLASSES.TILE}`),
  emptyTile: () => document.querySelector(`.${CSS_CLASSES.EMPTY_TILE}`),
  
  overlay: () => document.querySelector(`.${CSS_CLASSES.OVERLAY}`),
  loadingSpinner: () => document.querySelector(`.${CSS_CLASSES.LOADING_SPINNER}`),
  winningAlert: () => document.querySelector(`.${CSS_CLASSES.WINNING_ALERT}`),
  
  btnCloseWinAlert: () => document.querySelector(`.${CSS_CLASSES.BTN_CLOSE_WIN_ALERT}`),
  btnReset: () => document.querySelector(`.${CSS_CLASSES.BTN_RESET}`),
};