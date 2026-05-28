"use client";

import { createContext, useContext, useState, useCallback } from "react";

export type TransitionType =
  | "ripple"
  | "wipe"
  | "shatter"
  | "fade"
  | null;

interface TransitionContextType {
  transition: TransitionType;
  triggerTransition: (type: TransitionType, callback?: () => void) => void;
}

const TransitionContext = createContext<TransitionContextType>({
  transition: null,
  triggerTransition: () => {},
});

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [transition, setTransition] = useState<TransitionType>(null);

  const triggerTransition = useCallback(
    (type: TransitionType, callback?: () => void) => {
      setTransition(type);
      setTimeout(() => {
        callback?.();
        setTimeout(() => setTransition(null), 800);
      }, 600);
    },
    []
  );

  return (
    <TransitionContext.Provider value={{ transition, triggerTransition }}>
      {children}
    </TransitionContext.Provider>
  );
}

export const useTransition = () => useContext(TransitionContext);