export function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateSequence({ min, max, inclusive = false }) {
  // Calculate the number of items in the sequence.
  // The original `max` was exclusive, so (max - min) gives the correct length.
  // If inclusive, we add 1 to the length.
  const length = max - min + (inclusive ? 1 : 0);

  // Return an empty array for invalid ranges to prevent errors.
  if (length < 0) {
    return [];
  }

  // Use Array.from to create and populate the array in a single step.
  // The second argument is a map function that runs for each new element.
  return Array.from({ length }, (_, i) => min + i);
}