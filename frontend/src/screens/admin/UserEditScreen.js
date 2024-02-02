import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../slices/usersApiSlice";

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, isAdmin });
      toast.success("user updated successfully");
      refetch();
      navigate("/admin/userlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  return (
    <div>
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Edit User</h1>
        {loadingUpdate && <h2>loading...</h2>}
        {isLoading ? (
          <h2>loading...</h2>
        ) : error ? (
          <h2>{error?.data?.message || error.error}</h2>
        ) : (
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-600"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 p-2 border rounded-md w-full"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-2 border rounded-md w-full"
              />
            </div>

            <div className="mb-4">
              <input
                type="checkbox"
                id="isadmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="mr-2"
              />
              <label
                htmlFor="isadmin"
                className="text-sm font-medium text-gray-600"
              >
                Is Admin
              </label>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md"
            >
              Update
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserEditScreen;
