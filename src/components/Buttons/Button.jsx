import React from "react";
import Loader from "../Loaders/Loader";

const Button = ({
  title,
  handleClick,
  type = "button",
  extraStyles = "",
  loading,
  isLoading,
  disabled = false,
  children,
}) => {
  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center px-6 py-2 text-xs font-medium text-center text-white rounded-md bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-500/50 disabled:opacity-70 disabled:py-0 disabled:hover:bg-primary-500 disabled:saturate-30 disabled:cursor-not-allowed ${extraStyles}`}
      type={type}
      disabled={disabled || loading}
    >
      {(isLoading || loading) && <Loader extraStyles={"w-6 h-6 !bg-transparent !static"} />}
      {title}
      {children}
    </button>
  );
};

export default Button;
