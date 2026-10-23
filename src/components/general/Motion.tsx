"use client";
import React from "react";
import { HTMLMotionProps, motion, Variants } from "framer-motion";

export const easeOut = [0.26, 1, 0.4, 1] as const;

// Child variant for anything inside <Stagger>
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: easeOut } },
};

type StaggerProps = HTMLMotionProps<"div"> & {
  delay?: number;
  stagger?: number;
};

// Reveals its fadeUp/fadeIn children one after another
export const Stagger: React.FC<StaggerProps> = ({
  delay = 0,
  stagger = 0.08,
  ...rest
}) => (
  <motion.div
    initial="hidden"
    animate="show"
    variants={{
      hidden: {},
      show: { transition: { delayChildren: delay, staggerChildren: stagger } },
    }}
    {...rest}
  />
);

export const StaggerItem: React.FC<HTMLMotionProps<"div">> = (props) => (
  <motion.div variants={fadeUp} {...props} />
);

// Gentle idle bob for illustrations
export const Float: React.FC<HTMLMotionProps<"div">> = (props) => (
  <motion.div
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
    {...props}
  />
);
