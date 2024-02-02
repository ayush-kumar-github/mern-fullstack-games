import React from "react";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from "../../slices/productsApiSlice";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import Paginate from "../../components/Paginate";

const ListProductScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });
  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const createProductHandler = async () => {
    if (window.confirm("create new product?")) {
      try {
        await createProduct();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  return (
    <div className="">
      {loadingCreate && <h2>loading....</h2>}
      {loadingDelete && <h2>loading....</h2>}
      {isLoading ? (
        <h2>loading....</h2>
      ) : error ? (
        <h2 variant="danger">{error?.data?.message}</h2>
      ) : (
        <div className="p-14">
          <h2 className="font-bold text-2xl">products</h2>
          <h2 className="text-sm mt-2">click on ids to access the product</h2>

          <button
            className="p-1 bg-green-500 rounded my-1"
            onClick={createProductHandler}
          >
            create product
          </button>
          <table className="mb-4">
            <thead>
              <tr>
                <th className="px-4 py-2">id</th>
                <th className="px-4 py-2">name</th>
                <th className="px-4 py-2">brand</th>
                <th className="px-4 py-2">count in stock</th>
                <th className="px-4 py-2">price</th>
                <th className="px-4 py-2">reviews</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {data?.products?.map((item) => (
                <tr key={item._id}>
                  <td className="border px-4 py-2">{item._id}</td>
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border px-4 py-2">{item.brand}</td>
                  <td className="border px-4 py-2">{item.countInStock}</td>
                  <td className="border px-4 py-2">${item.price}</td>
                  <td className="border px-4 py-2">
                    {item.numReviews}({item.rating})
                  </td>
                  <td className="border px-4 py-2">
                    <Link to={`/admin/product/${item._id}/edit`}>✏️</Link>{" "}
                  </td>
                  <td className="border px-4 py-2 ">
                    <button onClick={() => deleteHandler(item._id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </div>
      )}
    </div>
  );
};

export default ListProductScreen;
