import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { clearCartItems } from "../slices/cartSlice";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (!cart.shippingAddress.address || !cart.paymentMethod) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
      <div className="p-6 bg-white rounded-md shadow-md">
        <div className="space-y-4">
          <h3 className="font-bold text-xl md:text-3xl text-gray-800">
            Customer Information
          </h3>
          <div className="text-md md:text-xl">
            <h2 className="font-bold">{auth.userInfo.name}</h2>
            <h2>{auth.userInfo.email}</h2>
          </div>
          <h3 className="text-md md:text-xl">
            <span className="font-bold text-gray-800">Shipping Address:</span>{" "}
            {cart.shippingAddress.address}, {cart.shippingAddress.city}-
            {cart.shippingAddress.postalCode},{cart.shippingAddress.country}
          </h3>
          <h2 className="text-md md:text-xl">
            <span className="font-bold text-gray-800">Mode of Payment</span>{" "}
            {cart.paymentMethod}
          </h2>
          <div>
            <h2 className="text-md md:text-xl font-bold text-gray-800">
              Ordered Items
            </h2>
            {cart.cartItems.length === 0 ? (
              <h2>Cart is empty</h2>
            ) : (
              cart?.cartItems?.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-100 rounded-md mb-2"
                >
                  <img
                    src={
                      item.imageUrl.startsWith("/")
                        ? `http://localhost:5000${item.imageUrl}`
                        : item.imageUrl
                    }
                    alt="fd"
                    className="h-10"
                  />
                  <h2 className="text-gray-800">{item.name}</h2>

                  <h2>
                    {item.price} * {item.qty} = {item.price * item.qty}
                  </h2>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-md shadow-md">
        <h2 className="font-bold text-md md:text-2xl text-gray-800 mb-6">
          Order Summary
        </h2>

        <h2 className="text-md md:text-xl">
          Price of Ordered Items: ${cart.itemsPrice}
        </h2>
        <h2 className="text-md md:text-xl">
          Item Price: ${cart.shippingPrice}
        </h2>
        <h2 className="text-md md:text-xl">Total Price: ${cart.totalPrice}</h2>
        {error && (
          <h2 className="text-md md:text-xl text-red-500">
            {error.data.message}
          </h2>
        )}
        <button
          className="bg-red-300 p-2 rounded cursor-pointer mt-4 text-white"
          onClick={placeOrderHandler}
          disabled={cart.cartItems === 0}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
