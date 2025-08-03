export function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a sequence of numbers.
 * @param {object} [options={}] - The options for generating the sequence.
 * @param {number} [options.min=1] - The starting number of the sequence.
 * @param {number} [options.max=10] - The ending number of the sequence.
 * @param {boolean} [options.inclusive=false] - Whether the max number should be included.
 * @param {boolean} [options.random=true] - Whether to shuffle the sequence.
 * @returns {number[]} The generated sequence of numbers.
 */
export function generateSequence({ min = 1, max = 10, inclusive = false, random = true } = {}) {
  // `max` is exclusive by default. If inclusive, we add 1 to the length.
  const length = max - min + (inclusive ? 1 : 0);

  // Return an empty array for invalid ranges to prevent errors.
  if (length < 0) {
    return [];
  }

  // Use Array.from to create and populate the array in a single step.
  const sequence = Array.from({ length }, (_, i) => min + i);

  return random ? shuffleArray(sequence) : sequence;
}

/**
 * Shuffles an array in-place using the Fisher-Yates (aka Knuth) algorithm.
 * @param {Array<any>} array The array to shuffle.
 * @returns {Array<any>} The shuffled array (same as the input array).
 */
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}