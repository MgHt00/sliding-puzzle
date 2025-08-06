import { CSS_CLASSES } from '../constants/cssClassNames.js';

export const SELECTORS = {
  overlay: () => document.querySelector(`.${CSS_CLASSES.OVERLAY}`),
  loadingSpinner: () => document.querySelector(`.${CSS_CLASSES.LOADING_SPINNER}`),
  board: () => document.querySelector(`.${CSS_CLASSES.BOARD}`),
  allTiles: () => document.querySelectorAll(`.${CSS_CLASSES.TILE}`),
  emptyTile: () => document.querySelector(`.${CSS_CLASSES.EMPTY_TILE}`),
};