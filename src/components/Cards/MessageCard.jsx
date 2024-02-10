import React from "react";
import { convertTime } from "../../utils";

const MessageCard = ({
  facility,
  title,
  opening_date,
  start_time,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between p-1 pr-3 bg-gray-100 rounded-md hover:bg-gray-200"
    >
      <div className="flex items-center">
        <img
          src={facility.profile_image}
          className="rounded-md w-11 h-11"
          alt="facility profile"
        />

        <p className="flex flex-col items-start ml-2">
          <span className="text-sm font-semibold">{title}</span>
          <span className="mt-1 text-xs">{opening_date}</span>
        </p>
      </div>
      <span className="text-xs">{convertTime(start_time)}</span>
    </button>
  );
};

export default MessageCard;
