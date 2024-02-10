import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { navLinks } from "../constants/data";
import { VscClose } from "react-icons/vsc";
import { useSelector } from "react-redux";

const Navbar = ({ toggle, setToggle }) => {
  const user = useSelector((state) => state.user);
  const navigation = navLinks[user.role];

  return (
    <>
      <nav
        id="navbar"
        className={`flex flex-col justify-between h-screen overflow-y-auto absolute md:static top-0 left-0 border-r bg-white ${
          toggle ? "" : "-translate-x-full md:-translate-x-0"
        } max-md:transition-all max-md:duration-300 w-full max-w-[220px] px-5 pb-7 md:py-8 z-[3]`}
      >
        <div>
          {/* close btn (inside navbar) */}
          <button
            onClick={() => setToggle(false)}
            className="mt-3 text-lg md:hidden"
          >
            <VscClose />
          </button>

          <h1 className="text-sm">Hospital Management</h1>

          {navigation.map((data) => (
            <NavItem key={data.title} data={data} />
          ))}
        </div>
      </nav>
    </>
  );
};

const NavItem = ({ data }) => {
  const location = useLocation();
  const [toggle, setToggle] = useState(false);

  // if Nav item is a link
  if (!data.items) {
    return (
      <NavLink
        to={data.path}
        className={({ isActive }) => {
          return `${
            isActive ? "text-primary-500 font-semibold" : "text-[#091A35]"
          } flex items-center hover:text-primary-500 my-4`;
        }}
      >
        {data.icon}
        <span className="ml-2 text-xs capitalize">
          {data.title.replaceAll("_", " ")}
        </span>
      </NavLink>
    );
  }

  // if Nav item is a Dropdown
  return (
    <>
      <div
        className={`flex items-center my-4 mb-2 cursor-pointer text-[#091A35] hover:text-primary-500 ${
          location.pathname.includes(data.path) ? "!text-primary-500" : ""
        }`}
        onClick={() => setToggle(!toggle)}
      >
        {data.icon}
        <span className="ml-2 text-xs capitalize">
          {data.title.replaceAll("_", " ")}
        </span>
      </div>
      <div
        className={`${toggle ? "block" : "hidden"} relative ml-[26px] text-xs`}
      >
        <div className="absolute left-[1px] bg-[#909090] w-0.5 h-full -z-10" />
        {data.items.map(({ path, title }) => {
          return (
            <NavLink
              key={title}
              to={path}
              className={({ isActive }) => {
                return `${
                  isActive ? "font-semibold" : "font-normal"
                } group flex items-center max-w-fit transition-all duration-300 hover:font-semibold text-[#909090] z-10`;
              }}
            >
              <div
                className={`${
                  window.location.pathname === path
                    ? "bg-[#909090] scale-110"
                    : "bg-[#D9D9D9]"
                } group-hover:bg-[#909090] relative right-0.5 group-hover:scale-125 rounded-full transition-all duration-300 w-2 h-2 mr-1 my-2`}
              />
              {title}
            </NavLink>
          );
        })}
      </div>
    </>
  );
};

export default Navbar;
