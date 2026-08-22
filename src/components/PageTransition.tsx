"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  pageTransition,
  pageTransitionReduced,
  transitionBase,
} from "@/lib/motion";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={reduce ? pageTransitionReduced : pageTransition}
      transition={
        reduce
          ? { duration: 0.15 }
          : { ...transitionBase, duration: 0.38 }
      }
    >
      {children}
    </motion.div>
  );
}
