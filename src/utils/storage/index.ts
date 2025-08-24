export class LocalStorage {
  /**
   * Checks if localStorage is available (client-side only)
   */
  private static isAvailable(): boolean {
    return typeof window !== "undefined" && typeof localStorage === "object";
  }

  /**
   * Gets an item from localStorage
   * @param key The key to retrieve
   * @returns The value or null if not found or on server
   */
  public static getItem(key: string): string | null {
    if (!this.isAvailable()) {
      return null;
    }
    return localStorage.getItem(key);
  }

  /**
   * Gets an item from localStorage with Promise API
   * @param key The key to retrieve
   * @returns Promise resolving to value or null
   */
  public static async getItemAsync(key: string): Promise<string | null> {
    return Promise.resolve(this.getItem(key));
  }

  /**
   * Sets an item in localStorage
   * @param key The key to set
   * @param value The value to store
   * @returns boolean indicating success
   */
  public static setItem(key: string, value: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }
    localStorage.setItem(key, value);
    return true;
  }

  /**
   * Sets an item in localStorage with Promise API
   * @param key The key to set
   * @param value The value to store
   * @returns Promise resolving when complete
   */
  public static async setItemAsync(key: string, value: string): Promise<boolean> {
    return Promise.resolve(this.setItem(key, value));
  }

  /**
   * Removes an item from localStorage
   * @param key The key to remove
   * @returns boolean indicating success
   */
  public static removeItem(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }
    localStorage.removeItem(key);
    return true;
  }

  /**
   * Removes an item from localStorage with Promise API
   * @param key The key to remove
   * @returns Promise resolving when complete
   */
  public static async removeItemAsync(key: string): Promise<boolean> {
    return Promise.resolve(this.removeItem(key));
  }

  /**
   * Clears all localStorage items
   * @returns boolean indicating success
   */
  public static clear(): boolean {
    if (!this.isAvailable()) {
      return false;
    }
    localStorage.clear();
    return true;
  }

  /**
   * Clears all localStorage items with Promise API
   * @returns Promise resolving when complete
   */
  public static async clearAsync(): Promise<boolean> {
    return Promise.resolve(this.clear());
  }
}
