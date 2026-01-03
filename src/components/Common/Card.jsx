import React from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Card = ({ children, className = "", hoverEffect = true, noPadding = false, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={
        hoverEffect
          ? {
              y: -4,
              boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.08)",
            }
          : {}
      }
      style={{ borderRadius: "var(--radius-card, 16px)" }}
      className={cn(
        "glass-card overflow-hidden text-[var(--text-primary)]",
        noPadding ? "p-0" : "p-6",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
