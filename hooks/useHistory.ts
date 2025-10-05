import { useState, useCallback, useRef } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface UseHistoryReturn<T> {
  state: T;
  setState: (newState: T | ((prev: T) => T), skipHistory?: boolean) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  reset: (initialState: T) => void;
}

export function useHistory<T>(initialState: T, maxHistorySize: number = 50): UseHistoryReturn<T> {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const isSettingFromHistory = useRef(false);

  const setState = useCallback((newState: T | ((prev: T) => T), skipHistory: boolean = false) => {
    if (skipHistory || isSettingFromHistory.current) {
      setHistory((current) => ({
        ...current,
        present: typeof newState === 'function' ? (newState as (prev: T) => T)(current.present) : newState,
      }));
      return;
    }

    setHistory((current) => {
      const nextState = typeof newState === 'function' ? (newState as (prev: T) => T)(current.present) : newState;

      if (JSON.stringify(nextState) === JSON.stringify(current.present)) {
        return current;
      }

      const newPast = [...current.past, current.present];
      if (newPast.length > maxHistorySize) {
        newPast.shift();
      }

      return {
        past: newPast,
        present: nextState,
        future: [],
      };
    });
  }, [maxHistorySize]);

  const undo = useCallback(() => {
    setHistory((current) => {
      if (current.past.length === 0) return current;

      const previous = current.past[current.past.length - 1];
      const newPast = current.past.slice(0, current.past.length - 1);

      isSettingFromHistory.current = true;
      setTimeout(() => {
        isSettingFromHistory.current = false;
      }, 0);

      return {
        past: newPast,
        present: previous,
        future: [current.present, ...current.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((current) => {
      if (current.future.length === 0) return current;

      const next = current.future[0];
      const newFuture = current.future.slice(1);

      isSettingFromHistory.current = true;
      setTimeout(() => {
        isSettingFromHistory.current = false;
      }, 0);

      return {
        past: [...current.past, current.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const reset = useCallback((initialState: T) => {
    setHistory({
      past: [],
      present: initialState,
      future: [],
    });
  }, []);

  return {
    state: history.present,
    setState,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    reset,
  };
}
