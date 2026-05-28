"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCursor, CursorMode } from "@/context/CursorContext";

const RING_SIZE: Record<CursorMode, number> = {
  default: 36,
  magnetic: 56,
  text: 80,
  image: 96,
  "button-ripple": 48,
  "button-wipe": 48,
  "button-shatter": 48,
  hidden: 0,
};

const RING_COLOR: Record<CursorMode, string> = {
  default: "rgba(34,211,238,0.5)",
  magnetic: "rgba(34,211,238,0.8)",
  text: "rgba(255,255,255,0.15)",
  image: "rgba(34,211,238,0.9)",
  "button-ripple": "rgba(139,92,246,0.7)",
  "button-wipe": "rgba(251,191,36,0.7)",
  "button-shatter": "rgba(239,68,68,0.7)",
  hidden: "transparent",
};

export default function CustomCursor() {
  const { cursor } = useCursor();

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const dotX = useSpring(rawX, { stiffness: 800, damping: 50 });
  const dotY = useSpring(rawY, { stiffness: 800, damping: 50 });
  const ringX = useSpring(rawX, { stiffness: 120, damping: 22 });
  const ringY = useSpring(rawY, { stiffness: 120, damping: 22 });

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const move = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [rawX, rawY]);

  const ringSize = RING_SIZE[cursor.mode];
  const ringColor = RING_COLOR[cursor.mode];
  const isText = cursor.mode === "text";
  const showLabel = cursor.mode === "image" && cursor.label;

  return (
    <>
      {/* Outer ring — lags behind cursor elegantly */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          border: isText ? "none" : `1.5px solid ${ringColor}`,
          background: isText ? "rgba(255,255,255,0.08)" : "transparent",
          backdropFilter: isText ? "invert(1)" : "none",
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: cursor.mode === "hidden" ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        {showLabel && (
          <span className="text-[10px] font-medium text-white tracking-widest uppercase">
            {cursor.label}
          </span>
        )}
      </motion.div>

      {/* Inner dot — snaps instantly */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] bg-cyan-400"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isText || cursor.mode === "hidden" ? 0 : 6,
          height: isText || cursor.mode === "hidden" ? 0 : 6,
          opacity: cursor.mode === "hidden" ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 800, damping: 50 }}
      />
    </>
  );
}