import React from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for class merging
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const variantStyles = {
  primary: "bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)] shadow-lg shadow-[var(--action-primary)]/20 border-transparent",
  secondary: "bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border-default)] hover:bg-[var(--bg-secondary)] border shadow-sm",
  outline: "bg-transparent border-2 border-[var(--action-primary)] text-[var(--action-primary)] hover:bg-[var(--action-primary)]/10",
  ghost: "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]",
  danger: "bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600",
  success: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600",
  gradient: "bg-gradient-to-r from-[var(--action-primary)] to-[var(--accent-secondary)] text-white shadow-lg shadow-[var(--action-primary)]/30 hover:opacity-90 border-transparent",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-8 py-4 text-lg",
};

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon = null,
  className = "",
  fullWidth = false,
  type = "button",
  ...props
}) => {
  return (
    <motion.button
      type={type}
      style={{ borderRadius: "var(--radius-button, 8px)" }}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-bold tracking-tight transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? "w-full" : "",
        className
      )}
      whileHover={!disabled && !loading ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;
