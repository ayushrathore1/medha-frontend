import React from "react";

const Loader = ({ size = 16, colorClass = "border-violet-500" }) => (
  <div className="flex justify-center items-center min-h-[120px]">
    {/* Ambient blurred ring background */}
    <div className="absolute z-0 w-28 h-28 rounded-full bg-gradient-to-tr from-violet-500/20 via-blue-500/10 to-purple-500/10 blur-2xl opacity-40" />
    {/* Spinner */}
    <div
      className={`relative z-10 w-${size} h-${size} border-4 ${colorClass} border-dashed rounded-full animate-spin border-t-transparent`}
      style={{
        minWidth: `${size * 4}px`,
        minHeight: `${size * 4}px`,
      }}
    />
  </div>
);

export default Loader;
