import type { Transition, Variants } from "framer-motion";

/** Shared easing — soft, not springy bounce. */
export const easeOut = [0.22, 1, 0.36, 1] as const;

export const duration = {
  fast: 0.28,
  base: 0.42,
  slow: 0.55,
} as const;

export const transitionBase: Transition = {
  duration: duration.base,
  ease: easeOut,
};

export const transitionFast: Transition = {
  duration: duration.fast,
  ease: easeOut,
};

/** Subtle entrance: fade + slight rise + tiny scale. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

/** Reduced-motion: opacity only. */
export const revealReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitionBase,
  },
};

export const staggerItemReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

export const pageTransitionReduced: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};
