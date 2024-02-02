import React from "react";

const ShimmerHome = () => {
  return (
    <div className="p-10 m-2 flex space-x-4">
      {/* Shimmer Cards */}
      {[1, 2, 3, 4, 5].map((index) => (
        <div
          key={index}
          className="h-80 w-[20%] bg-gray-200 animate-pulse rounded"
        ></div>
      ))}
    </div>
  );
};

export default ShimmerHome;
