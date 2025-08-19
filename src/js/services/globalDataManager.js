import { globals } from "./globals.js";
import { STATE_KEYS } from "../constants/appConstants.js";

export function fetchDefaults() {
  return globals.defaults;
}

export function fetchState() {
  return globals.appState;
}

export function fetchContentType() {
  return globals.appState[STATE_KEYS.CONTENT_TYPE];
}

export function fetchBoardSize() {
  return globals.appState[STATE_KEYS.BOARD_SIZE];
}

export function fetchRandom() {
  return globals.appState[STATE_KEYS.RANDOM];
}

export function setContentType(contentType) {
  globals.appState[STATE_KEYS.CONTENT_TYPE] = contentType;
}

export function setBoardSize(boardSize) {
  globals.appState[STATE_KEYS.BOARD_SIZE] = boardSize;
}

export function setRandom(random) {
  globals.appState[STATE_KEYS.RANDOM] = random;
}

export function setGameInProgress(gameInProgress) {
  globals.appState[STATE_KEYS.GAME_IN_PROGRESS] = gameInProgress;
}

export function fetchGameInProgress() {
  return globals.appState[STATE_KEYS.GAME_IN_PROGRESS];
}