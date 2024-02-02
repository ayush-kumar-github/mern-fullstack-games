import React from "react";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";
import { Link } from "react-router-dom";

const ListOrderScreen = () => {
  const { data, isLoading, error } = useGetOrdersQuery();
  return (
    <div className="p-14">
      <h2 className="text-2xl font-bold  ">list of orders</h2>
      <h3 className="text-sm  mt-1 ">click on ids to view order in detail</h3>
      <table>
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">date</th>
            <th className="px-4 py-2">total</th>
            <th className="px-4 py-2">payment</th>
            <th className="px-4 py-2">delivered</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => (
            <tr key={item._id}>
              <td className="border px-4 py-2">
                <Link to={`/order/${item._id}`}>{item._id}</Link>
              </td>
              <td className="border px-4 py-2">{item?.user?.name}</td>
              <td className="border px-4 py-2">
                {item.createdAt.substring(0, 10)}
              </td>
              <td className="border px-4 py-2">${item.totalPrice}</td>
              <td className="border px-4 py-2">{item.isPaid ? "🟢" : "🔴"}</td>
              <td className="border px-4 py-2">
                {item.isDelivered ? "🟢" : "🔴"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListOrderScreen;
