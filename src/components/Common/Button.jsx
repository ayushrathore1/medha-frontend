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

// GLASS/AMBIENT BUTTON VARIANTS
const variantStyles = {
  primary: `
    backdrop-blur-xl bg-blue-500/90 border border-blue-400/50 text-white font-semibold shadow-lg
    hover:bg-blue-600 hover:border-blue-500 hover:shadow-xl
    active:bg-blue-800 active:scale-95 transition-colors
    disabled:bg-blue-300/40 disabled:border-blue-300 disabled:text-white/60 disabled:shadow-none
  `,
  secondary: `
    backdrop-blur-xl bg-white/10 border border-violet-400/40 text-violet-300 font-semibold shadow
    hover:bg-violet-500/30 hover:text-white
    active:scale-95 transition-colors
    disabled:bg-white/5 disabled:border-white/10 disabled:text-gray-400 disabled:shadow-none
  `,
  outline: `
    bg-transparent border border-blue-400/60 text-blue-300 font-medium
    hover:bg-blue-500/10 hover:text-white
    active:scale-95 transition-colors
    disabled:text-gray-500 disabled:border-gray-500 disabled:shadow-none
  `,
  ghost: `
    bg-transparent text-white border border-transparent
    hover:bg-violet-500/10 hover:text-violet-300
    active:scale-95 transition-colors
    disabled:text-gray-500
  `,
  danger: `
    backdrop-blur-xl bg-red-600/85 border border-red-500/50 text-white
    hover:bg-red-700 hover:border-red-600
    active:bg-red-800 active:scale-95 transition-colors
    disabled:bg-red-300/30 disabled:border-red-300 disabled:text-white/60 disabled:shadow-none
  `,
  success: `
    backdrop-blur-xl bg-emerald-600/85 border border-emerald-400/40 text-white
    hover:bg-emerald-700 hover:border-emerald-500
    active:bg-emerald-800 active:scale-95 transition-colors
    disabled:bg-emerald-300/40 disabled:border-emerald-300 disabled:text-white/60 disabled:shadow-none
  `,
};

// SIZES
const sizeStyles = {
  small: "px-4 py-2 text-sm min-h-[40px] min-w-[44px] rounded-xl",
  medium: "px-5 py-3 text-base min-h-[44px] min-w-[48px] rounded-2xl",
  large: "px-8 py-4 text-lg min-h-[52px] min-w-[56px] rounded-3xl",
};
const responsiveSizes = {
  small: "sm:px-5 sm:py-2.5 sm:text-base",
  medium: "sm:px-6 sm:py-3.5 sm:text-lg",
  large: "sm:px-10 sm:py-5 sm:text-xl",
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
<<<<<<< HEAD
  const LoadingSpinner = () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-5 h-5 border-2 border-current border-t-transparent rounded-full mx-2"
    />
  );

  const getIconSpacing = () =>
    !icon || loading ? "" : iconPosition === "left" ? "mr-2" : "ml-2";

=======
  // Spinner: matches dashboard style
  const LoadingSpinner = () => (
    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mx-2" />
  );
  // Icon gap
  const getIconSpacing = () =>
    !icon || loading ? "" : iconPosition === "left" ? "mr-2" : "ml-2";
  // Click handler
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };
<<<<<<< HEAD

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
=======
  // Width
  const widthStyles = fullWidth ? "w-full" : "";
  // Final combined classes
  const buttonClassName = [
    "font-inter font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed inline-flex items-center justify-center border select-none shadow-lg",
    sizeStyles[size],
    responsiveSizes[size],
    variantStyles[variant],
    widthStyles,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={buttonClassName}
      {...props}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      style={{
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
        userSelect: "none",
        ...props.style,
      }}
    >
      {/* Loading spinner */}
      {loading && <LoadingSpinner />}
      {/* Icon left */}
      {!loading && icon && iconPosition === "left" && (
        <span className={getIconSpacing()}>{icon}</span>
      )}
      {/* Text */}
      {!loading && <span className="truncate">{children}</span>}
      {/* Icon right */}
      {!loading && icon && iconPosition === "right" && (
        <span className={getIconSpacing()}>{icon}</span>
      )}
    </button>
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
  );
};

export default Button;
