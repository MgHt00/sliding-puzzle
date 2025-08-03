import { STATE_KEYS, CONTENT_TYPES } from "../constants/appConstants.js";

/**
 * Defines the default state of the application.
 * This object should be treated as immutable.
 */
const defaultState = {
  [STATE_KEYS.CONTENT_TYPE]: CONTENT_TYPES.DEFAULT,
};

/**
 * Holds the current, mutable state of the application.
 * It's initialized with a copy of the default state.
 */
const appState = { ...defaultState };

export const globals = {
  defaults: defaultState,
  state: appState,
};
