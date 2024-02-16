import React from "react";

const InvoiceCard = (data) => {
  const color =
    data.status.toLowerCase() === "paid"
      ? "text-green-600"
      : data.status.toLowerCase() === "unpaid"
      ? "text-red-600"
      : "";

  return (
    <button className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-100">
      <div className="flex items-center space-x-2">
        <img
          className="w-[45px] h-[45px] rounded-md object-cover object-center border"
          src={data?.user?.profile_image}
          alt="profile"
        />
        <p className="flex flex-col items-start space-y-1">
          <span className="text-sm font-medium">
            {data?.user?.facility_name}
          </span>
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
