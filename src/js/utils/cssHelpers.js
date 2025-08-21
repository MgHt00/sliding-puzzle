/**
 * @fileoverview A collection of helper functions for interacting with CSS custom properties.
 */

/**
 * Retrieves the value of a CSS custom property from a given element.
 * @param {HTMLElement} element - The element to get the property from.
 * @param {string} propertyName - The name of the CSS custom property (e.g., '--my-color').
 * @param {string} [returnType='string'] - The expected return type ('string' or 'number').
 * @returns {string|number|null} The value of the property, or null if not found.
 */
export function getCssCustomProperty(element, propertyName, returnType = 'string') {
  if (!element || !propertyName) {
    console.error('Element or property name is missing for getCssCustomProperty.');
    return null;
  }
  const style = getComputedStyle(element);
  const value = style.getPropertyValue(propertyName).trim();

  if (value === '') return null;

  return returnType === 'number' ? parseInt(value, 10) : value;
}

/**
 * Sets the value of a CSS custom property on a given element.
 * @param {HTMLElement} element - The element to set the property on.
 * @param {string} propertyName - The name of the CSS custom property.
 * @param {string|number} value - The value to set for the property.
 */
export function setCssCustomProperty(element, propertyName, value) {
  if (!element || !propertyName) {
    console.error('Element or property name is missing for setCssCustomProperty.');
    return;
  }
  element.style.setProperty(propertyName, String(value));
}
