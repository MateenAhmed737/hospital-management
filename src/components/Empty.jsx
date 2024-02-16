import React from "react";
import EmptyImg from "../assets/images/empty.png";

const Empty = ({ title = "No data found!", noMargin = false }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <img
        src={EmptyImg}
        className={"w-full max-w-xs mx-auto" + (noMargin ? "" : " mt-8")}
        alt={title}
      />
      <span className="text-sm text-primary-500">{title}</span>
    </div>
  );
};

export default Empty;
