import moment from "moment";
import React from "react";

const JobCard = ({ facility, title, country, start_time }) => {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-200 rounded-md">
      <div className="flex items-center">
        <img
          src={facility.profile_image}
          className="rounded-md w-11 h-11"
          alt="facility profile"
        />

        <p className="flex flex-col ml-2">
          <span className="text-sm font-semibold">{title}</span>
          <span className="text-xs">{country}</span>
        </p>
      </div>
      <span className="text-xs">{moment().format("HH:mm A")}</span>
    </div>
  );
};

export default JobCard;
