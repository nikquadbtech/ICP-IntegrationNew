import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom"; // Import Navigate component
import icp from "../../public/icp.png";
import { useAuth } from "./utils/useAuthClient";

// Login component
const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle login
  const handleLogin = async () => {
    setIsLoading(true);
    await login().then(() => window.location.reload());
  };

  // If the user is authenticated, navigate to the dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />; // Render Navigate component to redirect
  }

  return (
    <div className="flex flex-col items-center justify-center w-full bg-[#f1f1f1]" style={{ height: `calc(100vh - 93px)` }}>
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl p-4 sm:p-6 md:p-10 lg:p-10 xl:p-12 2xl:p-14 bg-white rounded-xl shadow-lg flex flex-col gap-4">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-blue-900 underline decoration-2 underline-offset-4">Log in to Access Dashboard</h2>
        <p className="text-justify text-md sm:text-lg md:text-lg text-gray-600 lg:my-3 md:my-2 sm:my-1 max-h-32 overflow-y-auto px-4">You are just one step away from access your dashboard. Please log in now to access your dashboard. Click on below button to log in with internet identity.</p>
        <div className="flex mt-4 w-full justify-center">
          <button
            className="flex gap-2 justify-center items-center py-1 px-4 border-2  rounded-xl cursor-pointer border-blue-900 hover:bg-blue-900 hover:text-white duration-300 ease-in-out"
            onClick={() => { !isLoading ? handleLogin() : '' }}
          >
            <img src={icp} alt="logo" className="w-10 h-10" />
            <span className="text-md lg:text-lg md:text-lg font-semibold">
              {isLoading ? "Loading..." : "Internet Identity"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
