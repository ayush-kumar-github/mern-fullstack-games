import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { resetCart } from "../slices/cartSlice";

const Header = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleAdminMenu, setToggleAdminMenu] = useState(false);

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  const handleToggle = () => {
    setToggleMenu(!toggleMenu);
  };

  const handleAdminToggle = () => {
    setToggleAdminMenu(!toggleAdminMenu);
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between bg-black p-2 font-bold">
      <div className="flex items-center">
        <h2 className="text-4xl font-bold text-green-700">
          <Link to="/">Gamers🎮</Link>
        </h2>
      </div>
      <ul className="flex cursor-pointer items-center">
        <li className="md:py-1 md:px-2 py-2 px-4 text-white">
          <Link to="/about">About</Link>
        </li>
        {userInfo && (
          <li className="md:py-1 md:px-2 py-2 px-4">
            <Link to="/cart" className="flex items-center">
              🛒
              <span className="bg-green-700 rounded px-2 ml-1">
                {cartItems.reduce((acc, c) => acc + c.qty, 0)}
              </span>
            </Link>
          </li>
        )}
        <li className="md:py-1 md:px-2 py-2 px-4">
          {userInfo ? (
            <div className="relative inline-block text-left">
              <div>
                <button
                  onClick={handleToggle}
                  type="button"
                  className="text-white px-2 py-1"
                >
                  {userInfo.name}
                </button>
              </div>

              <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                {toggleMenu && (
                  <div className="py-1" role="none">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      type="button"
                      onClick={logoutHandler}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button className="font-black text-white px-2 py-1 rounded">
              <Link to="/login">Login</Link>
            </button>
          )}
        </li>
        <li className="md:ml-4">
          {userInfo && userInfo.isAdmin && (
            <div className="relative inline-block text-left">
              <div>
                <button
                  onClick={handleAdminToggle}
                  type="button"
                  className="text-white px-2 py-1"
                >
                  Admin
                </button>
              </div>

              <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                {toggleAdminMenu && (
                  <ul className="py-1" role="none">
                    <li>
                      <Link
                        to="/admin/orderlist"
                        className="block px-4 py-2 text-sm text-black"
                      >
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/userlist"
                        className="block px-4 py-2 text-sm text-black"
                      >
                        Users
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/productlist"
                        className="block px-4 py-2 text-sm text-black"
                      >
                        Products
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Header;
