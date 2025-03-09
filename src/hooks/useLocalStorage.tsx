"use client";

import { useState } from "react";

function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window !== "undefined") {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.error("Error reading from localStorage", error);
        return initialValue;
      }
    }
    return initialValue;
  });

  const setValue = (value: T) => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
      setStoredValue(value);
    } catch (error) {
      console.error("Error saving to localStorage", error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
