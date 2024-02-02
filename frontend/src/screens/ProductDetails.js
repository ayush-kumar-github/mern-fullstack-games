import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Rating from "../components/Rating";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../slices/productsApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const { data, isLoading, error, refetch } = useGetProductDetailsQuery(id);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const [qty, setQty] = useState(1);
  const [comment, setComment] = useState("");
  const [ratings, setRatings] = useState(0);

  const {
    name = "",
    description = "",
    price = 0,
    imageUrl = "",
    brand = "",
    category = "",
    countInStock = 0,
    rating = 0,
    numReviews = 0,
    reviews = [],
  } = data || {};

  const cartHandler = () => {
    dispatch(addToCart({ ...data, qty }));
    navigate("/cart");
  };
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        id,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
      setRatings(0);
      setComment("");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5">
      <div>
        <img
          className="w-full md:w-[80%] mx-auto"
          alt="img"
          src={
            imageUrl.startsWith("/")
              ? `http://localhost:5000${imageUrl}`
              : imageUrl
          }
        />
      </div>
      <div>
        <h2 className="font-bold text-2xl md:text-4xl py-3">{name}</h2>
        <h3 className="text-xl md:text-2xl pb-5">{brand}</h3>

        <h3 className="text-xl md:text-2xl pb-2">
          <Rating value={rating} />
        </h3>
        <h3 className="text-base md:text-xl">
          <span className="font-bold">Description:</span>
          {description}
        </h3>
        <h3 className="text-base md:text-xl py-2">
          <span className="font-bold">Game Category:</span>
          {category}
        </h3>
        {countInStock > 0 ? (
          <button className="p-1 bg-green-400  ">In Stock 😊</button>
        ) : (
          <button className="p-1 bg-red-400">Out of Stock 🥺</button>
        )}
        <h3 className="text-xl md:text-3xl font-bold py-4">${price}</h3>
        {countInStock > 0 && (
          <div className="flex px-0 py-3">
            <label htmlFor="quantity">Quantity:</label>
            <div className="flex ml-3">
              <button
                onClick={() => {
                  if (qty > 1) setQty(qty - 1);
                }}
                className="px-2 rounded bg-green-500 "
              >
                -
              </button>
              <h2 className="px-2">{qty}</h2>
              <button
                onClick={() => {
                  if (qty < countInStock) setQty(qty + 1);
                }}
                className="px-2 rounded bg-green-500 "
              >
                +
              </button>
            </div>
          </div>
        )}
        {countInStock > 0 ? (
          <button
            onClick={cartHandler}
            className="bg-red-400 px-6 py-2 rounded text-white "
          >
            Add to Cart
          </button>
        ) : (
          <button className="bg-gray-400 px-4 py-2 rounded text-white ">
            Add to Cart
          </button>
        )}
      </div>
      <div>
        <h2 className="text-3xl font-bold mb-4">Reviews</h2>
        {reviews.length === 0 && <h2>No Reviews</h2>}
        <ul>
          {reviews.map((review) => (
            <li
              key={review._id}
              className="mb-4 text-white bg-black w-full md:w-[50%] rounded p-2"
            >
              <strong className="block text-lg font-semibold">
                {review.name}
              </strong>
              <div className="flex mt-2">
                <Rating value={review.ratings} />
                <p className="ml-3 ">{review.comment}</p>
              </div>
              <p className="text-white-600">
                Created on date - {review.createdAt.substring(0, 10)}
              </p>
            </li>
          ))}
          <li>
            {userInfo ? (
              <form onSubmit={submitHandler}>
                <div className="my-8">
                  <label
                    htmlFor="rating"
                    className="block text-sm font-medium text-gray-700 "
                  >
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={ratings}
                    onChange={(e) => setRatings(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select...</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>

                <div className="my-4">
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="3"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mt-1 p-1 border border-gray-300 rounded-md w-full"
                  ></textarea>
                </div>

                <button
                  disabled={loadingProductReview}
                  type="submit"
                  className="bg-green-500 text-white p-1 rounded-md cursor-pointer"
                >
                  Submit
                </button>
              </form>
            ) : (
              <p>
                Please <Link to="/login">sign in</Link> to write a review.
              </p>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProductDetails;
