"use client";

import { useEffect, useState } from "react";

/**
 * useLocalStoragePref — persist a small UI preference to localStorage.
 *
 * SSR-safe: returns the default on the first render, then hydrates from
 * localStorage in a useEffect. This avoids hydration mismatches where the
 * server-rendered HTML doesn't match the localStorage-hydrated client.
 */
export function useLocalStoragePref<T extends string>(
  key: string,
  defaultValue: T,
): [T, (next: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);

  // Hydrate from localStorage after mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        setValue(raw as T);
      }
    } catch {
      // localStorage can throw in sandboxed contexts — ignore
    }
  }, [key]);

  function update(next: T) {
    setValue(next);
    try {
      window.localStorage.setItem(key, next);
    } catch {
      // ignore
    }
  }

  return [value, update];
}
