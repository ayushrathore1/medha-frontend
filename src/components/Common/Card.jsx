import React from "react";
import { motion } from "framer-motion";

const Card = ({ children, className = "", hoverEffect = true, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={
        hoverEffect
          ? {
              y: -5,
              boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.1)",
            }
          : {}
      }
      className={`
        backdrop-blur-xl
        border-2
        rounded-2xl shadow-lg
        p-6
        transition-all duration-300
        ${className}
      `}
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--accent-secondary)",
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
