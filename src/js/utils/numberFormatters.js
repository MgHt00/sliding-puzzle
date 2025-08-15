/**
 * An array of Japanese numerals from 1 to 99.
 * This allows for easy conversion by using the number as an index (number - 1).
 */
const JAPANESE_NUMERALS = [
  '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '二十一', '二十二', '二十三', '二十四', '二十五', '二十六', '二十七', '二十八', '二十九', '三十'
  // ... can be extended for larger boards
];

/**
 * Converts an Arabic number to its Japanese numeral equivalent.
 * @param {number} number - The number to convert.
 * @returns {string} The Japanese numeral as a string, or the original number if not found.
 */
export function toJapaneseNumeral(number) {
  return JAPANESE_NUMERALS[number - 1] || String(number);
}
