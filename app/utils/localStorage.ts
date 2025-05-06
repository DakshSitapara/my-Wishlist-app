
  export const getWishlistForUser = <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error getting item '${key}' from localStorage`, error);
      return null;
    }
  };
  
  export const setLocalStorage = <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item '${key}' in localStorage`, error);
    }
  };
  
  export const removeLocalStorage = (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item '${key}' from localStorage`, error);
    }
  };
  
  export const clearLocalStorage = (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  };
  