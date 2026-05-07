'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Generic async data fetching hook
 * @param {Function} fetchFn - async function to call
 * @param {any[]} deps - dependency array (refetch when changed)
 * @param {object} options - { immediate, defaultData }
 */
export function useAsyncData(fetchFn, deps = [], options = {}) {
  const { immediate = true, defaultData = null } = options;
  const [data, setData] = useState(defaultData);
  const [isLoading, setIsLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const execute = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      if (mountedRef.current) setData(result);
      return result;
    } catch (err) {
      if (mountedRef.current) setError(err.message || 'An error occurred');
      throw err;
    } finally {
      if (mountedRef.current && !isSilent) setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (immediate) execute();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute]);

  const refetch = useCallback((isSilent = false) => execute(isSilent), [execute]);

  return { data, isLoading, error, refetch, setData };
}

/**
 * Polling hook – calls fetchFn on interval
 * @param {Function} fetchFn
 * @param {number} interval - ms
 * @param {any[]} deps
 */
export function usePolling(fetchFn, interval = 30000, deps = []) {
  const result = useAsyncData(fetchFn, deps);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      result.refetch(true); // Pass true for silent refresh
    }, interval);
    return () => clearInterval(intervalRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval, result.refetch]);

  return result;
}

/**
 * Debounce hook
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
