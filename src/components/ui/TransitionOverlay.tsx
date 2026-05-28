"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTransition } from "@/context/TransitionContext";

function RippleTransition() {
  return (
    <motion.div
      className="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(34,211,238,${0.3 - i * 0.08}) 0%, transparent 70%)`,
            border: "1px solid rgba(34,211,238,0.4)",
          }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: "220vw", height: "220vw", opacity: 0 }}
          transition={{
            duration: 0.9,
            delay: i * 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </motion.div>
  );
}

function WipeTransition() {
  return (
    <motion.div className="fixed inset-0 z-[9998] flex pointer-events-none">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: [0, 1, 1, 0] }}
          transition={{
            duration: 0.9,
            delay: i * 0.035,
            times: [0, 0.4, 0.6, 1],
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            originY: i % 2 === 0 ? 0 : 1,
            background: i % 2 === 0
              ? "rgba(34,211,238,0.12)"
              : "rgba(139,92,246,0.12)",
            backdropFilter: "blur(12px)",
            flex: 1,
          }}
        />
      ))}
    </motion.div>
  );
}

function ShatterTransition() {
  const pieces = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotate: Math.random() * 360,
    size: 60 + Math.random() * 180,
    color: i % 3 === 0 ? "#22d3ee" : i % 3 === 1 ? "#8b5cf6" : "#06b6d4",
  }));

  return (
    <motion.div
      className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 0.6 }}
    >
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
            background: `${p.color}22`,
            border: `1px solid ${p.color}66`,
          }}
          initial={{ scale: 0, rotate: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.2, 0],
            rotate: p.rotate,
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 0.8,
            delay: Math.random() * 0.25,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </motion.div>
  );
}

function FadeTransition() {
  return (
    <motion.div
      className="fixed inset-0 z-[9998] pointer-events-none"
      style={{ background: "rgba(5,8,22,0.95)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 0.8, times: [0, 0.3, 0.7, 1] }}
    />
  );
}

export default function TransitionOverlay() {
  const { transition } = useTransition();
  return (
    <AnimatePresence>
      {transition === "ripple" && <RippleTransition key="ripple" />}
      {transition === "wipe" && <WipeTransition key="wipe" />}
      {transition === "shatter" && <ShatterTransition key="shatter" />}
      {transition === "fade" && <FadeTransition key="fade" />}
    </AnimatePresence>
  );
}