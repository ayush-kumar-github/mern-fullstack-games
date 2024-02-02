import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useGetOrderDetailsQuery,
  useDeliverOrderMutation,
} from "../slices/ordersApiSlice";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    console,
    error,
  } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",

          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  const { userInfo } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("order delivered");
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  async function onApproveTest() {
    await payOrder({ orderId, details: { player: {} } });
    refetch();
    toast.success("payment successfull");
  }
  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  };
  const onError = (err) => {
    toast.error(err.message);
  };
  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("payment successful");
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    });
  };

  return isLoading ? (
    <h1>loading</h1>
  ) : error ? (
    <h1>{error?.data?.message || error.error}</h1>
  ) : (
    <div>
      <div className="max-w-2xl mx-auto bg-white p-8 shadow-md rounded-md mt-8">
        <h1 className="text-2xl font-bold border-b-2 pb-2">
          Order ID: {orderId}
        </h1>
        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
          <button
            onClick={deliverHandler}
            className="px-2  py-1 mt-2 bg-black text-white rounded"
          >
            mark delivered
          </button>
        )}

        <h2 className="text-lg mt-2">
          <span className="font-bold">User Details:</span> {order.user.name} (
          {order.user.email})
        </h2>
        <h2 className="text-lg">
          <span className="font-bold">Address:</span>{" "}
          {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
          {order.shippingAddress.postalCode}, {order.shippingAddress.country}
        </h2>
        <h2 className="text-lg  mb-4">
          {" "}
          <span className="font-bold">Payment Method:</span>
          {order.paymentMethod}
        </h2>
        <div>
          {order?.isDelivered ? (
            <button className="p-1 bg-green-500 rounded">delivered</button>
          ) : (
            <button className="p-1 bg-red-500 rounded text-white">
              not deliverd
            </button>
          )}
          {order?.isPaid ? (
            <button className="p-1 bg-green-500 rounded text-white ml-2">
              Paid on {order.paidAt}
            </button>
          ) : (
            <button className="p-1 bg-red-500 rounded text-white ml-2">
              Not Paid
            </button>
          )}
        </div>

        <h2 className="text-lg font-bold mt-4">Items in your list:</h2>
        {order.orderItems.length === 0 ? (
          <h2 className="text-lg text-red-500 font-bold mt-4">Cart is empty</h2>
        ) : (
          <ul className="">
            {order?.orderItems?.map((item, index) => (
              <li className="text-sm text-blue-800  mt-2 mr-3" key={index}>
                {item.name} * {item.qty}
              </li>
            ))}
          </ul>
        )}
        <div className=" font-bold text-black-900 my-2">
          Total Price: ${order.totalPrice}
        </div>
        <div>
          {!order?.isPaid && (
            <h2>
              {loadingPay && <h3>loading....</h3>}
              {isPending ? (
                <h2>loading....</h2>
              ) : (
                <div>
                  <div>
                    <PayPalButtons
                      className="w-[60%]"
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    ></PayPalButtons>
                  </div>
                </div>
              )}
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;
