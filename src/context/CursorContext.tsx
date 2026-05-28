"use client";

import { createContext, useContext, useState, useCallback } from "react";

export type CursorMode =
  | "default"
  | "magnetic"
  | "text"
  | "image"
  | "button-ripple"
  | "button-wipe"
  | "button-shatter"
  | "hidden";

interface CursorState {
  mode: CursorMode;
  label: string;
  color: string;
}

interface CursorContextType {
  cursor: CursorState;
  setCursor: (state: Partial<CursorState>) => void;
  resetCursor: () => void;
}

const defaultState: CursorState = {
  mode: "default",
  label: "",
  color: "#22d3ee",
};

const CursorContext = createContext<CursorContextType>({
  cursor: defaultState,
  setCursor: () => {},
  resetCursor: () => {},
});

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [cursor, setCursorState] = useState<CursorState>(defaultState);

  const setCursor = useCallback((state: Partial<CursorState>) => {
    setCursorState((prev) => ({ ...prev, ...state }));
  }, []);

  const resetCursor = useCallback(() => {
    setCursorState(defaultState);
  }, []);

  return (
    <CursorContext.Provider value={{ cursor, setCursor, resetCursor }}>
      {children}
    </CursorContext.Provider>
  );
}

export const useCursor = () => useContext(CursorContext);