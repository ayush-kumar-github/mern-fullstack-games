import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../slices/cartSlice";
import { savePaymentMethod } from "../slices/cartSlice";

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-4">Address Screen</h2>
        <form>
          <label className="block mb-2">Address:</label>
          <input
            type="text"
            placeholder="Enter address"
            value={address}
            required
            className="bg-gray-200 rounded p-2 w-full"
            onChange={(e) => setAddress(e.target.value)}
          />
          <label className="block mb-2">City:</label>
          <input
            type="text"
            className="bg-gray-200 rounded p-2 w-full"
            placeholder="Enter city"
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          />
          <label className="block mb-2">Postal Code</label>
          <input
            type="text"
            placeholder="Enter postal code"
            className="bg-gray-200 rounded p-2 w-full"
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          />
          <label className="block mb-2">Country</label>
          <input
            type="text"
            placeholder="Enter country"
            className="bg-gray-200 rounded p-2 w-full"
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
          />
        </form>
      </div>

      <div>
        <form className="max-w-sm mx-auto mt-8">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Select Method
            </label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-5 w-5 text-indigo-600"
                  value="PayPal"
                  checked={paymentMethod === "PayPal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="ml-2">PayPal or Credit Card</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full md:w-auto"
            onClick={submitHandler}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingScreen;
