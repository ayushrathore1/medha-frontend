import React from "react";
import { motion } from "framer-motion";

// BUTTON VARIANTS
const variantStyles = {
  primary: `
    bg-[var(--action-primary)] text-white shadow-lg shadow-indigo-500/20
    hover:bg-[var(--action-secondary)] hover:shadow-indigo-500/40
    border border-transparent
  `,
  secondary: `
    bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--accent-secondary)]/30
    hover:bg-[var(--accent-secondary)]/20 hover:border-[var(--accent-secondary)]
  `,
  outline: `
    bg-transparent border-2 border-[var(--action-primary)] text-[var(--action-primary)]
    hover:bg-[var(--action-primary)]/5
  `,
  ghost: `
    bg-transparent text-[var(--text-secondary)] border border-transparent
    hover:bg-[var(--accent-secondary)]/10 hover:text-[var(--action-primary)]
  `,
  danger: `
    bg-red-500/90 text-white shadow-lg shadow-red-500/20
    hover:bg-red-600
  `,
  success: `
    bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/20
    hover:bg-emerald-600
  `,
};

// SIZES
const sizeStyles = {
  small: "px-4 py-2 text-sm rounded-lg",
  medium: "px-6 py-3 text-base rounded-xl",
  large: "px-8 py-4 text-lg rounded-2xl",
};

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon = null,
  className = "",
  fullWidth = false,
  type = "button",
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-semibold
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClasses}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
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
          Processing...
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
