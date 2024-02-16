import React from "react";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { useSelector } from "react-redux";

const InvoiceCard = (data) => {
  const user = useSelector((state) => state.user);
  const color =
    data.status.toLowerCase() === "paid"
      ? "text-green-600"
      : data.status.toLowerCase() === "unpaid"
      ? "text-red-600"
      : "";

  const fcData = data?.[user.isAdmin ? "user" : "facility"];
  const profileImage = fcData?.profile_image;

  return (
    <button
      onClick={data?.onClick}
      className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-100"
    >
      <div className="flex items-center space-x-2">
        {profileImage ? (
          <img
            className="w-[45px] h-[45px] rounded-md object-cover object-center border"
            src={profileImage}
            alt="profile"
          />
        ) : (
          <div className="w-[45px] h-[45px] rounded-md border text-xl flex justify-center text-gray-400 items-center bg-gray-200">
            <HiMiniBuildingOffice />
          </div>
        )}
        <p className="flex flex-col items-start space-y-1">
          <span className="text-sm font-medium">{fcData?.facility_name}</span>
          <span className="text-xs text-gray-400">
            {new Date(data.created_at).toLocaleString()}
          </span>
        </p>
      </div>

      <p className="flex flex-col items-end space-y-0.5">
        <span className={`text-xs ${color}`}>{data.status}</span>
        <span className="text-sm">
          ${Number(data.total_amount || 0).toFixed(2)}
        </span>
      </p>
    </button>
  );
};

export default InvoiceCard;
