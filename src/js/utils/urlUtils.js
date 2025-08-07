/**
 * Checks if the URL contains a 'test=win' query parameter.
 * This is a utility for easily setting up the board in a solved state for testing.
 * @returns {boolean} True if the test parameter is present and set to 'win'.
 */
export function isWinTestMode() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('test') === 'win';
}
