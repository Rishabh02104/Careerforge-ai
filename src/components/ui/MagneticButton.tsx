"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useCursor } from "@/context/CursorContext";
import { useTransition, TransitionType } from "@/context/TransitionContext";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  transitionType?: TransitionType;
  onClick?: () => void;
  cursorMode?: "button-ripple" | "button-wipe" | "button-shatter";
}

export default function MagneticButton({
  children,
  className = "",
  transitionType = "ripple",
  onClick,
  cursorMode = "button-ripple",
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [magnetX, setMagnetX] = useState(0);
  const [magnetY, setMagnetY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { setCursor, resetCursor } = useCursor();
  const { triggerTransition } = useTransition();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    // Magnetic pull — stronger when closer
    setMagnetX(dx * 0.35);
    setMagnetY(dy * 0.35);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setCursor({ mode: cursorMode });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMagnetX(0);
    setMagnetY(0);
    resetCursor();
  };

  const handleClick = () => {
    triggerTransition(transitionType, onClick);
  };

  return (
    <motion.button
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      animate={{
        x: magnetX,
        y: magnetY,
        scale: isHovered ? 1.06 : 1,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Inner text also shifts slightly for depth */}
      <motion.span
        className="relative z-10 block"
        animate={{
          x: magnetX * 0.2,
          y: magnetY * 0.2,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
      >
        {children}
      </motion.span>

      {/* Hover glow fill */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={isHovered ? { scale: 1.5, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)",
        }}
      />
    </motion.button>
  );
}