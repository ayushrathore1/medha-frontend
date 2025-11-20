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
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  icon,
  iconPosition = "left",
  className = "",
  ...props
}) => {
  const LoadingSpinner = () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-5 h-5 border-2 border-current border-t-transparent rounded-full mx-2"
    />
  );

  const getIconSpacing = () =>
    !icon || loading ? "" : iconPosition === "left" ? "mr-2" : "ml-2";

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={`
        relative font-sans font-semibold flex items-center justify-center transition-colors duration-200
        disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {loading && <LoadingSpinner />}
      
      {!loading && icon && iconPosition === "left" && (
        <span className={getIconSpacing()}>{icon}</span>
      )}
      
      {!loading && <span>{children}</span>}
      
      {!loading && icon && iconPosition === "right" && (
        <span className={getIconSpacing()}>{icon}</span>
      )}
    </motion.button>
  );
};

export default Button;
