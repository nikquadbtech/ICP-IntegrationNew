import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Error404 from "./components/utils/Error404";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";


// Layout component to include Navbar across all pages
const Layout = () => (
  <>
    <Navbar />
    <Outlet /> {/* This is where nested routes will render */}
  </>
);

// Define routes using createBrowserRouter
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Login /> },
      { path: "dashboard", element: <Dashboard /> }, // Default route
      
    ],
  },
  {
    path: "*",
    element: <Error404 />, // Catch-all route for 404 errors
  },
]);

// Render the application
const App = () => {
  return (
    <RouterProvider router={router}>
      {" "}
      
    </RouterProvider>
  );
};

export default App;