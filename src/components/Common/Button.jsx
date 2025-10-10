import React from "react";

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
  // Base styles with mobile-first approach
  const baseStyles =
    "font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed inline-flex items-center justify-center border select-none";

  // Mobile-first size variants with touch-friendly dimensions
  const sizeStyles = {
    small: "px-3 py-2 text-sm min-h-[40px] min-w-[40px]", // 40px minimum for accessibility
    medium: "px-4 py-2.5 text-base min-h-[44px] min-w-[44px]", // 44px Apple/iOS standard
    large: "px-6 py-3 text-lg min-h-[48px] min-w-[48px]", // 48px Android standard
  };

  // Responsive size adjustments
  const responsiveSizes = {
    small: "sm:px-4 sm:py-2.5 sm:text-base",
    medium: "sm:px-5 sm:py-3 sm:text-lg",
    large: "sm:px-8 sm:py-4 sm:text-xl",
  };

  // Variant styles with mobile-optimized contrast
  const variantStyles = {
    primary: `
      bg-blue-600 text-white border-blue-600 shadow-lg
      hover:bg-blue-700 hover:border-blue-700 hover:shadow-xl
      focus:ring-blue-500 
      active:bg-blue-800 active:scale-95
      disabled:bg-blue-300 disabled:border-blue-300 disabled:shadow-none
    `,
    secondary: `
      bg-white text-blue-600 border-blue-600 shadow-md
      hover:bg-blue-50 hover:shadow-lg
      focus:ring-blue-500
      active:bg-blue-100 active:scale-95
      disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:shadow-none
    `,
    outline: `
      bg-transparent text-blue-600 border-blue-600 shadow-sm
      hover:bg-blue-600 hover:text-white hover:shadow-md
      focus:ring-blue-500
      active:bg-blue-700 active:scale-95
      disabled:bg-transparent disabled:text-gray-400 disabled:border-gray-300 disabled:shadow-none
    `,
    ghost: `
      bg-transparent text-blue-600 border-transparent shadow-none
      hover:bg-blue-50 hover:shadow-sm
      focus:ring-blue-500
      active:bg-blue-100 active:scale-95
      disabled:text-gray-400 disabled:shadow-none
    `,
    danger: `
      bg-red-600 text-white border-red-600 shadow-lg
      hover:bg-red-700 hover:border-red-700 hover:shadow-xl
      focus:ring-red-500
      active:bg-red-800 active:scale-95
      disabled:bg-red-300 disabled:border-red-300 disabled:shadow-none
    `,
    success: `
      bg-green-600 text-white border-green-600 shadow-lg
      hover:bg-green-700 hover:border-green-700 hover:shadow-xl
      focus:ring-green-500
      active:bg-green-800 active:scale-95
      disabled:bg-green-300 disabled:border-green-300 disabled:shadow-none
    `,
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
  );

  // Icon spacing based on position
  const getIconSpacing = () => {
    if (!icon || loading) return "";
    return iconPosition === "left" ? "mr-2" : "ml-2";
  };

  // Handle click with loading state
  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  // Full width responsive styling
  const widthStyles = fullWidth ? "w-full" : "";

  // Combine all styles
  const buttonClassName = [
    baseStyles,
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
      // Accessibility attributes
      aria-disabled={disabled || loading}
      aria-busy={loading}
      // Touch optimization
      style={{
        WebkitTapHighlightColor: "transparent", // Remove blue highlight on mobile
        touchAction: "manipulation", // Improve touch responsiveness
        userSelect: "none", // Prevent text selection
        ...props.style,
      }}
    >
      {/* Loading state */}
      {loading && <LoadingSpinner />}

      {/* Icon - Left position */}
      {!loading && icon && iconPosition === "left" && (
        <span className={getIconSpacing()}>{icon}</span>
      )}

      {/* Button content */}
      {!loading && <span className="truncate">{children}</span>}

      {/* Icon - Right position */}
      {!loading && icon && iconPosition === "right" && (
        <span className={getIconSpacing()}>{icon}</span>
      )}
    </button>
  );
};

export default Button;
