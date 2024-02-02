import React, { useState, useEffect } from "react";
import { useProfileMutation } from "../slices/usersApiSlice";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password does not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.name]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1 p-6 ">
        <h2 className="font-bold text-2xl pb-4">Update profile</h2>
        <form onSubmit={submitHandler} className="max-w-sm">
          <label className="block mb-2">Name:</label>
          <input
            type="name"
            placeholder="Enter name"
            value={name}
            required
            className="bg-gray-200 rounded p-2 mb-2  w-[100%]"
            onChange={(e) => setName(e.target.value)}
          />
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            placeholder="Enter email"
            className="bg-gray-200 rounded p-2 mb-2  w-[100%]"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="block mb-2">Password:</label>
          <input
            type="password"
            placeholder="Enter password"
            className="bg-gray-200 rounded p-2 mb-2  w-[100%]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="block mb-2">Confirm Password:</label>
          <input
            type="password"
            placeholder="Confirm password"
            className="bg-gray-200 rounded p-2 mb-2  w-[100%]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="bg-black text-white py-2 px-4 rounded w-full">
            Update
          </button>
        </form>
      </div>
      <div className="md:col-span-2 p-8">
        <h2 className="font-bold text-2xl pb-4">My orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 ">
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-20 border-b ml-6">DATE</th>
                <th className="py-2 px-8 border-b">TOTAL</th>
                <th className="py-2 px-8 border-b">PAID</th>
                <th className="py-2 px-8 border-b">DELIVERED</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order._id}>
                  <td className="py-2 px-4 border-b">
                    <Link
                      to={`/order/${order._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {order._id}
                    </Link>
                  </td>
                  <td className="py-2 px-20 border-b ml-6">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className="py-2 px-8 border-b">{order.totalPrice}</td>
                  <td className="py-2 px-8 border-b">
                    {order.isPaid ? (
                      order?.paidAt.substring(0, 10)
                    ) : (
                      <span className="text-red-500">🔴</span>
                    )}
                  </td>
                  <td className="py-2 px-8 border-b">
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <span className="text-red-500 ">🔴</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
