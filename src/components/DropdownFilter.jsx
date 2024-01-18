import React from "react";
import { FaChevronUp } from "react-icons/fa";

const DropdownContainer = ({ extraStyles = "", onClick, children }) => {
  return (
    <ul
      onClick={onClick}
      className={`absolute top-[110%] right-0 flex flex-col text-xs bg-white/70 backdrop-blur-sm rounded-md px-4 py-1 shadow-md border z-10 ${extraStyles}`}
    >
      {children}
    </ul>
  );
};

const DropdownFilter = ({
  arr,
  title,
  state,
  toggle,
  setToggle,
  handleClick,
}) => {
  return (
    <button
      onClick={setToggle}
      className={`relative min-w-max flex items-center text-black ${
        state !== ""
          ? "bg-blue-100 hover:bg-blue-200"
          : "bg-gray-50 hover:bg-gray-100"
      } focus:outline-1 focus:outline-gray-800 font-medium rounded-lg text-xs px-4 py-2 ml-3 text-center capitalize`}
    >
      {state || title}
      <FaChevronUp className={`${toggle ? "" : "rotate-180"} ml-2`} />
      {toggle && (
        <DropdownContainer extraStyles="!w-full !min-w-max !p-0 overflow-hidden">
          <li
            onClick={() => handleClick(null)}
            role="option"
            aria-selected={!state}
            className={`flex mx-1 mt-1 rounded-md p-2 py-1 cursor-pointer text-gray-800 hover:bg-gray-300/40 hover:text-black`}
          >
            All
          </li>
          {arr.map((elem, indx) => (
            <li
              key={elem + indx}
              onClick={() => handleClick(elem)}
              role="option"
              aria-selected={elem === state}
              className={`flex m-1 ${
                indx === arr.length - 1 ? "mb-1 mt-0" : "my-0"
              } rounded-md p-2 py-1 cursor-pointer text-gray-800 hover:bg-gray-300/40 hover:text-black`}
            >
              {elem}
            </li>
          ))}
        </DropdownContainer>
      )}
    </button>
  );
};

export default DropdownFilter;
