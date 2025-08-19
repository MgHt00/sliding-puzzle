import { CSS_CLASSES } from "./cssClassNames.js";

export const STATE_KEYS = {
  CONTENT_TYPE: 'contentType',
  RANDOM: 'random',
  GAME_IN_PROGRESS: 'gameInProgress',
  BOARD_SIZE: 'boardSize',
}

export const SIZES = {
  THREE: 3,
  FOUR: 4,
}

export const BOARD_SIZE_CLASSES = {
  [SIZES.THREE]: CSS_CLASSES.THREE_BY_THREE_BOARD,
  [SIZES.FOUR]: CSS_CLASSES.FOUR_BY_FOUR_BOARD,
}

export const STATE_VALUES = {
  DEFAULT_CONTENT: 'arabic-numbers',
  DEFAULT_BOARD_SIZE: SIZES.THREE,
  RANDOM: true,
  GAME_IN_PROGRESS: false,
}

export const CONTENT_TYPES = {
  ARABIC_NUMBERS: 'arabic-numbers',
  JAPANESE_NUMBERS: 'japanese-numbers',
  // PHOTOS: 'photos', // for future use
}

export const ALERT = {
  TYPE_WON: 'won',
  TYPE_WARNING: 'warning',
  TYPE_DEFAULT: 'default',
  BTN_CONFIRM: 'OK',
  BTN_CANCEL: 'Cancel',
  WON_HEADER: 'Congratulations!',
  WON_TEXT: 'You have won the game!',
  WARN_HEADER: 'Sure?',
  WARN_TEXT: 'This will reset the game. Are you sure?',
}

export const TEXT = {
  WON: 'Congratulations! You have won!',
}

export const HTML_TAGS = {
  DIV: 'div',
  SPAN: 'span',
}