"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

/** Workbench with desk props; tilts with cursor (ramen-bowl style). */
export default function EngineeringWorkbench() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const rotateX = useSpring(useTransform(pointerY, [-1, 1], [8, -8]), {
    stiffness: 120,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(pointerX, [-1, 1], [-12, 12]), {
    stiffness: 120,
    damping: 18,
  });
  const shiftX = useSpring(useTransform(pointerX, [-1, 1], [-12, 12]), {
    stiffness: 90,
    damping: 20,
  });
  const shiftY = useSpring(useTransform(pointerY, [-1, 1], [-6, 6]), {
    stiffness: 90,
    damping: 20,
  });

  function onMove(e: React.MouseEvent | React.TouchEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const nx = ((clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((clientY - rect.top) / rect.height - 0.5) * 2;
    pointerX.set(Math.max(-1, Math.min(1, nx)));
    pointerY.set(Math.max(-1, Math.min(1, ny)));
  }

  function onLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <div
      ref={ref}
      className="relative w-full select-none"
      style={{ perspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onTouchMove={onMove}
      onTouchEnd={onLeave}
      aria-label="Interactive workbench. Move your cursor to tilt the desk."
    >
      <motion.div
        style={{ rotateX, rotateY, x: shiftX, y: shiftY, transformStyle: "preserve-3d" }}
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -4, 0] }}
          transition={
            reduce
              ? undefined
              : { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <svg
            viewBox="0 0 360 220"
            className="w-full drop-shadow-[0_18px_36px_rgba(180,120,50,0.22)]"
            role="img"
            aria-hidden
          >
            <defs>
              <linearGradient id="benchTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f5deb3" />
                <stop offset="50%" stopColor="#e8c49a" />
                <stop offset="100%" stopColor="#d4a574" />
              </linearGradient>
              <linearGradient id="benchFront" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c9a66b" />
                <stop offset="100%" stopColor="#a67c52" />
              </linearGradient>
            </defs>

            <ellipse cx="180" cy="198" rx="130" ry="14" fill="#d6d3d1" opacity="0.35" />
            <rect x="58" y="128" width="14" height="58" rx="2" fill="#a67c52" />
            <rect x="288" y="128" width="14" height="58" rx="2" fill="#a67c52" />
            <path d="M42 105 L318 105 L318 128 L42 128 Z" fill="url(#benchFront)" />
            <rect x="30" y="82" width="300" height="26" rx="6" fill="url(#benchTop)" />
            <rect x="38" y="86" width="284" height="5" rx="2" fill="#fff7ed" opacity="0.3" />

            {/* Items on the bench */}
            <g>
              {/* Oscilloscope */}
              <rect x="38" y="48" width="52" height="36" rx="4" fill="#52525b" />
              <rect x="42" y="52" width="44" height="22" rx="2" fill="#1c1917" />
              <motion.path
                d="M46 64 Q54 58 62 66 T78 60"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="1.5"
                strokeLinecap="round"
                animate={{
                  d: [
                    "M46 64 Q54 58 62 66 T78 60",
                    "M46 62 Q58 68 70 58 T78 64",
                    "M46 64 Q54 58 62 66 T78 60",
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <circle cx="46" cy="78" r="2" fill="#ef4444" />
              <motion.circle
                cx="54"
                cy="78"
                r="2"
                fill="#22c55e"
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />

              {/* PCB */}
              <rect x="118" y="52" width="44" height="30" rx="3" fill="#166534" />
              {[128, 142, 156].map((x, i) => (
                <motion.circle
                  key={x}
                  cx={x}
                  cy="62"
                  r="2"
                  fill="#fde047"
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}

              {/* Multimeter */}
              <rect x="178" y="50" width="36" height="34" rx="3" fill="#f5f5f4" stroke="#d6d3d1" />
              <rect x="184" y="58" width="24" height="12" rx="1" fill="#292524" />
              <text x="188" y="68" fill="#4ade80" fontSize="6" fontFamily="monospace">
                3.3V
              </text>

              {/* Coffee mug */}
              <g transform="translate(248, 52)">
                <motion.g
                  animate={{ y: [0, -1.5, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity }}
                >
                  <rect x="0" y="10" width="22" height="20" rx="3" fill="#fafaf9" stroke="#d6d3d1" />
                  <path
                    d="M22 14 Q30 14 30 22 Q30 28 22 28"
                    fill="none"
                    stroke="#d6d3d1"
                    strokeWidth="1.5"
                  />
                </motion.g>
                {[0, 1].map((i) => (
                  <motion.path
                    key={i}
                    d={`M8 ${8 - i * 5} Q10 ${0 - i * 5} 12 ${8 - i * 5}`}
                    fill="none"
                    stroke="#a8a29e"
                    strokeWidth="0.8"
                    opacity="0.5"
                    animate={{ y: [0, -5, 0], opacity: [0.2, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </g>

              {/* Soldering iron */}
              <g transform="translate(288, 58)">
                <rect x="0" y="8" width="28" height="8" rx="2" fill="#78716c" />
                <line x1="4" y1="16" x2="22" y2="16" stroke="#57534e" strokeWidth="2" />
                <motion.circle
                  cx="26"
                  cy="16"
                  r="3"
                  fill="#f59e0b"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </g>

              {/* Wire spool */}
              <circle cx="108" cy="78" r="10" fill="#d6d3d1" stroke="#a8a29e" />
              <circle cx="108" cy="78" r="5" fill="#fafaf9" />
            </g>
          </svg>
        </motion.div>
      </motion.div>

      <p className="mt-3 text-center text-xs text-stone-500">
        Move your cursor to play with the desk
      </p>
    </div>
  );
}
