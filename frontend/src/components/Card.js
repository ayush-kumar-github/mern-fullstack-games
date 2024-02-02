import React from "react";

const Card = ({ product }) => {
  return (
    <div className="pb-3">
      <img
        className="w-[100%] rounded h-60"
        src={
          product.imageUrl.startsWith("/")
            ? `http://localhost:5000${product.imageUrl}`
            : product.imageUrl
        }
        alt="iui"
      />
      <h2 className="text-xl font-bold mb-2 p-3">{product.name}</h2>
      <span className="text-gray-500 p-3">{product.brand}</span>
      <div>
        <span className="ml-2 p-1 mb-2 text-black-700 ">${product.price}</span>
      </div>
    </div>
  );
};

export default Card;
