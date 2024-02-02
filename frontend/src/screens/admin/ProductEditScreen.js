import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Toast, toast } from "react-toastify";
import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadProductImageMutation,
} from "../../slices/productsApiSlice";

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const fileUploadHandler = async (e) => {
    console.log(e.target.files[0]);
    const formData = new FormData();
    formData.append("imageUrl", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImageUrl(res.imageUrl);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        imageUrl,
        brand,
        category,
        description,
        countInStock,
      }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
      toast.success("Product updated");
      refetch();
      navigate("/admin/productlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImageUrl(product.imageUrl);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="my-4 font-bold text-2xl">ProductEditScreen</h2>
      {loadingUpdate && <h2>loading....</h2>}
      {isLoading ? (
        <h2>loading</h2>
      ) : error ? (
        <h2>{error.data.message}</h2>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600"
            >
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-1 border rounded w-full"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-600"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 p-1 border rounded w-full"
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              name="imageUrl"
              id="image"
              className="mt-1 p-1 border rounded w-full"
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />

            <input type="file" id="chooseFile" onChange={fileUploadHandler} />
          </div>

          <div className="mb-4">
            <label
              htmlFor="brand"
              className="block text-sm font-medium text-gray-600"
            >
              Brand
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="mt-1 p-1 border rounded w-full"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-600"
            >
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 p-1 border rounded w-full"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="countInStock"
              className="block text-sm font-medium text-gray-600"
            >
              Count In Stock
            </label>
            <input
              type="number"
              id="countInStock"
              name="countInStock"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              className="mt-1 p-1 border rounded w-full"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-600"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 p-1 border rounded w-full"
            />
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="bg-green-500 text-white p-1 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductEditScreen;
