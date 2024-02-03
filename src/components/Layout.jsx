import React, { useLayoutEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { FaBars } from "react-icons/fa";
import { useAppState } from "../hooks";

const Layout = () => {
  const [toggle, setToggle] = useState(false);
  const { homeRoute } = useAppState();
  const location = useLocation();

  useLayoutEffect(() => {
    setToggle(false);
  }, [location]);

  if (window.location.pathname === "/") return <Navigate to={homeRoute} />;

  return (
    <div className="relative flex h-screen font-poppins">
      <Navbar {...{ toggle, setToggle }} />

      <div className="w-full h-screen overflow-y-auto">
        <div className="w-full border-b shadow md:hidden">
          {/* Menu btn (bars icon) */}

          <p className="relative w-full py-2.5 text-center md:hidden">
            Hospital Management
            <button
              onClick={() => setToggle(true)}
              className={`absolute left-3 top-1/2 -translate-y-1/2 md:hidden text-black`}
            >
              <FaBars />
            </button>
          </p>
        </div>

        {/* Backdrop (when menu opens) */}
        <div
          onClick={() => setToggle(false)}
          className={`${
            toggle ? "" : "hidden"
          } md:hidden fixed inset-0 bg-black/40 z-[2]`}
        />

        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
