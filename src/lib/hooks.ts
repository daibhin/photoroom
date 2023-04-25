import { useState } from "react";

const APPLICATION_STATE_KEY = "state";

export function useLocalStorage<T>(initialValue: T) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(APPLICATION_STATE_KEY);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(APPLICATION_STATE_KEY, JSON.stringify(value));
    }
  };
  return [storedValue, setValue];
}
