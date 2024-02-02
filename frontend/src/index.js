import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import About from "./components/About";
import ProductDetails from "./screens/ProductDetails";
import HomeScreen from "./screens/HomeScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { store } from "./store";
import { Provider } from "react-redux";
import ShippingScreen from "./screens/ShippingScreen";
import PrivateRoutes from "./components/PrivateRoute";
import AdminRoutes from "./components/AdminRoute";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ListOrderScreen from "./screens/admin/ListOrderScreen";
import ListUserScreen from "./screens/admin/ListUserScreen";
import ListProductScreen from "./screens/admin/ListProductScreen";
import ProductEditScreen from "./screens/admin/ProductEditScreen";
import UserEditScreen from "./screens/admin/UserEditScreen";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomeScreen />,
      },
      {
        path: "/search/:keyword",
        element: <HomeScreen />,
      },
      {
        path: "/page/:pageNumber",
        element: <HomeScreen />,
      },
      {
        path: "/search/:keyword/page/:pageNumber",
        element: <HomeScreen />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/product/:id",
        element: <ProductDetails />,
      },
      {
        path: "/cart",
        element: <CartScreen />,
      },
      {
        path: "/login",
        element: <LoginScreen />,
      },
      {
        path: "/register",
        element: <RegisterScreen />,
      },
      {
        element: <PrivateRoutes />,
        children: [
          {
            path: "/shipping",
            element: <ShippingScreen />,
          },
          {
            path: "/placeorder",
            element: <PlaceOrderScreen />,
          },
          {
            path: "/order/:id",
            element: <OrderScreen />,
          },
          {
            path: "/profile",
            element: <ProfileScreen />,
          },
        ],
      },
      {
        element: <AdminRoutes />,
        children: [
          {
            path: "/admin/orderlist",
            element: <ListOrderScreen />,
          },
          {
            path: "/admin/productlist",
            element: <ListProductScreen />,
          },
          {
            path: "/admin/productlist/:pageNumber",
            element: <ListProductScreen />,
          },
          {
            path: "/admin/userlist",
            element: <ListUserScreen />,
          },
          {
            path: "/admin/product/:id/edit",
            element: <ProductEditScreen />,
          },
          {
            path: "/admin/user/:id/edit",
            element: <UserEditScreen />,
          },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>
);
