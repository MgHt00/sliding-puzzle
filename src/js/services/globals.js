import { STATE_KEYS, STATE_VALUES, CONTENT_TYPES } from "../constants/appConstants.js";

/**
 * Defines the default state of the application.
 * This object should be treated as immutable.
 */
const defaults = {
  [STATE_KEYS.CONTENT_TYPE]: STATE_VALUES.DEFAULT_CONTENT,
  [STATE_KEYS.BOARD_SIZE]: STATE_VALUES.DEFAULT_BOARD_SIZE,
  [STATE_KEYS.RANDOM]: STATE_VALUES.RANDOM,
  [STATE_KEYS.GAME_IN_PROGRESS]: STATE_VALUES.GAME_IN_PROGRESS,
};

/**
 * Holds the current, mutable state of the application.
 * It's initialized with a copy of the default state.
 */
const appState = { ...defaults };

export const globals = {
  defaults,
  appState,
};
