import React from "react";

const Loader = ({ size = 8, colorClass = "border-blue-600" }) => (
  <div className={`flex justify-center items-center`}>
    <div
      className={`w-${size} h-${size} border-4 ${colorClass} border-dashed rounded-full animate-spin border-t-transparent`}
    />
  </div>
);

export default Loader;
