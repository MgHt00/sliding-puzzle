import { CSS_CLASSES } from '../constants/cssClassNames.js';

export const SELECTORS = {
  overlay: () => document.querySelector(`.${CSS_CLASSES.OVERLAY}`),
  board: () => document.querySelector(`.${CSS_CLASSES.BOARD}`),
  allTiles: () => document.querySelectorAll(`.${CSS_CLASSES.TILE}`),
  emptyTile: () => document.querySelector(`.${CSS_CLASSES.EMPTY_TILE}`),
  loadingSpinner: () => document.querySelector(`.${CSS_CLASSES.LOADING_SPINNER}`),
  winningAlert: () => document.querySelector(`.${CSS_CLASSES.WINNING_ALERT}`),
  btnCloseWinAlert: () => document.querySelector(`.${CSS_CLASSES.BTN_CLOSE_WIN_ALERT}`),
};