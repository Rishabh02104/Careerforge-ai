"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Zap } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useCursor } from "@/context/CursorContext";
import { useTransition } from "@/context/TransitionContext";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Features",  href: "/#features", scroll: true,  transition: "fade" as const },
  { label: "Pricing",   href: "/#pricing",  scroll: true,  transition: "fade" as const },
  { label: "Roadmap",   href: "/roadmap",   scroll: false, transition: "fade" as const },
  { label: "About",     href: "/#about",    scroll: true,  transition: "fade" as const },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const navY = useTransform(scrollY, [0, 100], [0, -4]);
  const { setCursor, resetCursor } = useCursor();
  const { triggerTransition } = useTransition();
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === "/";

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

  function handleNavClick(
    href: string,
    scroll: boolean,
    transition: "fade" | "ripple" | "wipe" | "shatter"
  ) {
    if (scroll) {
      const hash = href.includes("#") ? href.substring(href.indexOf("#")) : href;
      if (isHome) {
        // Already on home — just scroll
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      } else {
        // On another page — go home then scroll
        triggerTransition(transition, () => {
          router.push(href);
        });
      }
    } else {
      triggerTransition(transition, () => router.push(href));
    }
    setMenuOpen(false);
  }

  function handleLogoClick() {
    if (isHome) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  }

  return (
    <>
      <motion.nav
        style={{ y: navY, x: mouseX * 0.3 }}
        className={`fixed top-4 left-1/2 z-50 flex w-[90%] max-w-5xl -translate-x-1/2 items-center justify-between rounded-2xl px-6 py-3 transition-all duration-500 ${
          scrolled
            ? "border border-white/10 bg-white/5 shadow-lg shadow-cyan-500/10 backdrop-blur-xl"
            : "border border-transparent bg-transparent"
        }`}
      >
        {/* ── Logo ─────────────────────────────────────────────────────────── */}
        <motion.div
          className="flex items-center gap-2 font-bold text-white cursor-pointer select-none"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          onClick={handleLogoClick}
          onMouseEnter={() => setCursor({ mode: "magnetic" })}
          onMouseLeave={resetCursor}
        >
          <Zap className="h-5 w-5 text-cyan-400" />
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            CareerForge
          </span>
        </motion.div>

        {/* ── Desktop nav links ─────────────────────────────────────────────── */}
        <div className="hidden items-center gap-6 text-sm text-gray-400 md:flex">
          {navLinks.map((link, i) => (
            <motion.button
              key={link.label}
              className="transition hover:text-cyan-400 bg-transparent border-none cursor-pointer text-sm text-slate-400"
              animate={{ y: [0, -2, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
              whileHover={{ y: -4, color: "#22d3ee" }}
              onMouseEnter={() => setCursor({ mode: "magnetic" })}
              onMouseLeave={resetCursor}
              onClick={() =>
                handleNavClick(link.href, link.scroll, link.transition)
              }
            >
              {link.label}
            </motion.button>
          ))}
        </div>

        {/* ── CTA buttons ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {user ? (
            // Logged in state
            <>
              <motion.button
                className="text-sm text-slate-400 hover:text-white transition bg-transparent border-none cursor-pointer hidden md:block"
                whileHover={{ y: -2 }}
                onMouseEnter={() => setCursor({ mode: "magnetic" })}
                onMouseLeave={resetCursor}
                onClick={() =>
                  triggerTransition("fade", () =>
                    router.push(
                      user.role === "admin" ? "/admin" : "/dashboard"
                    )
                  )
                }
              >
                {user.role === "admin" ? "⚡ Admin" : "Dashboard"}
              </motion.button>

              <div className="hidden md:flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-400">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>

              <motion.button
                className="text-xs text-slate-500 hover:text-red-400 transition bg-transparent border-none cursor-pointer hidden md:block"
                whileHover={{ y: -2 }}
                onClick={logout}
              >
                Sign out
              </motion.button>
            </>
          ) : (
            // Logged out state
            <>
              <motion.button
                className="text-sm text-slate-400 transition hover:text-white bg-transparent border-none cursor-pointer hidden md:block"
                whileHover={{ y: -2 }}
                onMouseEnter={() => setCursor({ mode: "button-wipe" })}
                onMouseLeave={resetCursor}
                onClick={() =>
                  triggerTransition("wipe", () => router.push("/login"))
                }
              >
                Login
              </motion.button>

              <motion.button
                className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-black cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  y: -3,
                  boxShadow: "0 8px 30px rgba(34,211,238,0.4)",
                }}
                whileTap={{ scale: 0.97 }}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                onMouseEnter={() => setCursor({ mode: "button-ripple" })}
                onMouseLeave={resetCursor}
                onClick={() =>
                  triggerTransition("ripple", () => router.push("/signup"))
                }
              >
                Get Started
              </motion.button>
            </>
          )}

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block w-5 h-px bg-slate-400 rounded-full"
                animate={
                  menuOpen
                    ? i === 0
                      ? { rotate: 45, y: 6 }
                      : i === 1
                      ? { opacity: 0 }
                      : { rotate: -45, y: -6 }
                    : { rotate: 0, y: 0, opacity: 1 }
                }
                transition={{ duration: 0.2 }}
              />
            ))}
          </motion.button>
        </div>
      </motion.nav>

      {/* ── Mobile menu ────────────────────────────────────────────────────── */}
      <AnimatePresenceWrapper>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-40 rounded-2xl border border-white/10 bg-[#050816]/95 backdrop-blur-xl p-4 flex flex-col gap-2 md:hidden"
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() =>
                  handleNavClick(link.href, link.scroll, link.transition)
                }
                className="text-left px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition"
              >
                {link.label}
              </button>
            ))}
            <div className="border-t border-white/5 pt-2 mt-1 flex flex-col gap-2">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      router.push(user.role === "admin" ? "/admin" : "/dashboard");
                      setMenuOpen(false);
                    }}
                    className="text-left px-4 py-2.5 rounded-xl text-sm text-cyan-400 hover:bg-cyan-500/10 transition"
                  >
                    {user.role === "admin" ? "⚡ Admin Panel" : "Dashboard"}
                  </button>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="text-left px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/5 transition"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      triggerTransition("wipe", () => router.push("/login"));
                      setMenuOpen(false);
                    }}
                    className="text-left px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/5 transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      triggerTransition("ripple", () => router.push("/signup"));
                      setMenuOpen(false);
                    }}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium bg-cyan-500 text-black"
                  >
                    Get Started →
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresenceWrapper>
    </>
  );
}

// Helper wrapper since AnimatePresence needs to be imported
function AnimatePresenceWrapper({ children }: { children: React.ReactNode }) {
  const { AnimatePresence } = require("framer-motion");
  return <AnimatePresence>{children}</AnimatePresence>;
}