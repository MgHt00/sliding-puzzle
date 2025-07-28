import { CSS_CLASSES } from '../constants/cssClassNames.js';

export const SELECTORS = {
  allTiles: () => document.querySelectorAll(`.${CSS_CLASSES.TILE}`),
  emptyTile: () => document.querySelector(`.${CSS_CLASSES.EMPTY_TILE}`),
};