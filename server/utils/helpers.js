/**
 * Escapes special regex characters in a string to prevent ReDoS attacks.
 * @param {string} string - The input string to escape.
 * @returns {string} The escaped string safe for use in RegExp.
 */
export const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
