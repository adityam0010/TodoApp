import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";

const Navbar = () => {
  const { logout, user } = useAuth();


  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-indigo-900 text-white dark:bg-gray-900">
      <div className="text-xl font-bold">My Task</div>

      <ul className="flex gap-6 items-center">
        

        {user && (
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-800 px-3 py-1 rounded text-white"
          >
            Logout
          </button>
        )}

        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isDark}
            onChange={() => setIsDark(!isDark)}
            className="hidden"
          />
          <div className="w-10 h-5 bg-gray-400 rounded-full p-1 flex items-center transition">
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                isDark ? "translate-x-5" : ""
              }`}
            ></div>
          </div>
          <span className="ml-2 text-sm">Dark Mode</span>
        </label>
      </ul>
    </nav>
  );
};

export default Navbar;