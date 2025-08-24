/**
 * Returns the keys of an enum
 * @param e The enum object
 * @returns Array of enum keys
 */
export function getEnumKeys<T extends object>(e: T): Array<keyof T> {
  const keys = Object.keys(e) as Array<keyof T>;

  return keys;
}

/**
 * Returns the values of an enum
 * @param e The enum object
 * @returns Array of enum values
 */
export function getEnumValues<T extends object, K extends keyof T = keyof T>(e: T): Array<T[K]> {
  const values = Object.values(e) as Array<T[K]>;

  return values;
}
