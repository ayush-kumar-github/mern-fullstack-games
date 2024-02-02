import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import { useNavigate } from "react-router-dom";

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, itemsPrice, shippingPrice, totalPrice } = useSelector(
    (state) => state.cart
  );

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const addtoCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="px-4 py-6">
      <h3 className="font-bold text-2xl md:text-4xl mb-6 mt-6 text-center">
        Shopping Cart
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {cartItems.map((product) => (
            <div key={product._id} className="flex flex-col p-4 mb-4 md:mb-0">
              <img
                alt="product"
                className="w-[40%] md:w-[30%] h-auto mb-2 md:mb-0"
                src={
                  product.imageUrl.startsWith("/")
                    ? `http://localhost:5000${product.imageUrl}`
                    : product.imageUrl
                }
              />
              <div className="flex flex-col md:ml-4">
                <h2 className="text-lg md:text-xl font-bold">{product.name}</h2>
                <p className="text-md md:text-lg">
                  {product.qty} x ${product.price} = $
                  {(product.qty * product.price).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center mt-2 md:mt-0 md:ml-4">
                <select
                  className="bg-gray-200 w-1/2 md:w-full"
                  value={product.qty}
                  onChange={(e) =>
                    addtoCartHandler(product, Number(e.target.value))
                  }
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
                <div
                  className="ml-2 cursor-pointer"
                  onClick={() => removeFromCartHandler(product._id)}
                >
                  🗑️
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-md md:text-xl pr-5">Items Total:</span>
              <span className="text-md md:text-xl">${itemsPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-md md:text-xl pr-9">Shipping:</span>
              <span className="text-md md:text-xl">${shippingPrice}</span>
            </div>
          </div>

          <div className="flex mt-4 border-t pt-4">
            <span className="font-bold text-md md:text-xl pr-4 md:pr-16">
              Total:
            </span>
            <span className="font-bold text-md md:text-xl">${totalPrice}</span>
          </div>
          <button
            className="bg-red-300 text-md md:text-lg rounded px-4 py-2 mt-4"
            onClick={checkoutHandler}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
