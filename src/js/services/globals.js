import { STATE_KEYS, CONTENT_TYPES } from "../constants/appConstants.js";

/**
 * Defines the default state of the application.
 * This object should be treated as immutable.
 */
const defaults = {
  [STATE_KEYS.CONTENT_TYPE]: CONTENT_TYPES.DEFAULT,
  [STATE_KEYS.RANDOM]: CONTENT_TYPES.RANDOM,
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
