"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  revealReduced,
  revealVariants,
  staggerContainer,
  staggerItem,
  staggerItemReduced,
  transitionBase,
} from "@/lib/motion";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-48px" }}
      variants={reduce ? revealReduced : revealVariants}
      transition={{ ...transitionBase, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Parent that staggers children using staggerItem variants. */
export function RevealStagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={reduce ? staggerItemReduced : staggerItem}
    >
      {children}
    </motion.div>
  );
}
