"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCursor } from "@/context/CursorContext";
import { useTransition } from "@/context/TransitionContext";

const navLinks = [
  { label: "Features",  href: "/#features",  transition: "fade" as const, scroll: true  },
  { label: "Dashboard", href: "/dashboard",   transition: "fade" as const, scroll: false },
  { label: "Pricing",   href: "/#pricing",   transition: "fade" as const, scroll: true  },
  { label: "About",     href: "/#about",     transition: "fade" as const, scroll: true  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const { scrollY } = useScroll();
  const navY = useTransform(scrollY, [0, 100], [0, -4]);
  const { setCursor, resetCursor } = useCursor();
  const { triggerTransition } = useTransition();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMouseX((e.clientX / window.innerWidth - 0.5) * 10);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

    const handleNavClick = (
    href: string,
    transition: "fade" | "ripple" | "wipe" | "shatter",
    scroll: boolean
  ) => {
    if (scroll) {
      // Extract the hash — e.g. "/#features" → "#features"
      const hash = href.split("/").pop() || href;
      const el = document.querySelector(hash);
      if (el) {
        // Already on homepage — just scroll
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        // On another page — navigate home then scroll
        triggerTransition(transition, () => {
          router.push(href);
        });
      }
    } else {
      triggerTransition(transition, () => router.push(href));
    }
  };

  return (
    <motion.nav
      style={{ y: navY, x: mouseX * 0.3 }}
      className={`fixed top-4 left-1/2 z-50 flex w-[90%] max-w-5xl -translate-x-1/2 items-center justify-between rounded-2xl px-6 py-3 transition-all duration-500 ${
        scrolled
          ? "border border-white/10 bg-white/5 shadow-lg shadow-cyan-500/10 backdrop-blur-xl"
          : "border border-transparent bg-transparent"
      }`}
    >
      {/* Logo */}
      <motion.div
        className="flex items-center gap-2 font-bold text-white cursor-pointer"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        onClick={() => router.push("/")}
        onMouseEnter={() => setCursor({ mode: "magnetic" })}
        onMouseLeave={resetCursor}
      >
        <Zap className="h-5 w-5 text-cyan-400" />
        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          CareerForge
        </span>
      </motion.div>

      {/* Nav Links */}
      <div className="hidden items-center gap-6 text-sm text-gray-400 md:flex">
        {navLinks.map((link, i) => (
          <motion.button
            key={link.label}
            className="transition hover:text-cyan-400 bg-transparent border-none cursor-pointer"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            whileHover={{ y: -4, color: "#22d3ee" }}
            onMouseEnter={() => setCursor({ mode: "magnetic" })}
            onMouseLeave={resetCursor}
            onClick={() => handleNavClick(link.href, link.transition, link.scroll)}
          >
            {link.label}
          </motion.button>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="flex items-center gap-3">
        <motion.button
          className="text-sm text-gray-400 transition hover:text-white bg-transparent border-none cursor-pointer"
          whileHover={{ y: -2 }}
          onMouseEnter={() => setCursor({ mode: "button-wipe" })}
          onMouseLeave={resetCursor}
          onClick={() => triggerTransition("wipe", () => router.push("/login"))}
        >
          Login
        </motion.button>
        <motion.button
          className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-black cursor-pointer"
          whileHover={{ scale: 1.05, y: -3, boxShadow: "0 8px 30px rgba(34,211,238,0.4)" }}
          whileTap={{ scale: 0.97 }}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          onMouseEnter={() => setCursor({ mode: "button-ripple" })}
          onMouseLeave={resetCursor}
          onClick={() => triggerTransition("ripple", () => router.push("/signup"))}
        >
          Get Started
        </motion.button>
      </div>
    </motion.nav>
  );
}