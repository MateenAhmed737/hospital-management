import React, { useState } from "react";
import { ShiftModal } from "../../Modals";
import { convertTime } from "../../../utils";
import { useNavigate } from "react-router-dom";
import { HiMiniBuildingOffice } from "react-icons/hi2";

const RecentJobCard = (data) => {
  const navigate = useNavigate();
  const [shiftModal, setShiftModal] = useState(false);

  return (
    <>
      <div className="p-2 py-1.5 bg-gray-100 border rounded-md">
        <div className="flex items-center justify-between p-1">
          <div className="flex items-center">
            {data.facility?.profile_image ? (
              <img
                src={data.facility?.profile_image}
                className="rounded-md w-11 h-11"
                alt="facility profile"
              />
            ) : (
              <div className="flex items-center justify-center bg-gray-200 rounded-md size-11">
                <HiMiniBuildingOffice className="text-2xl text-gray-400" />
              </div>
            )}

            <p className="flex flex-col items-start ml-2">
              <span className="text-sm font-semibold">{data.title}</span>
            </p>
          </div>
          <span className="text-sm font-semibold text-primary-500">
            ${Number(data.boost_fee || 0).toFixed(2)}
          </span>
        </div>
        <div className="w-full h-px my-1 bg-gray-300" />
        <div className="">
          <span className="text-xs">{data.description}</span>

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs">Shift Date: {data.opening_date}</span>
            <button
              onClick={() => setShiftModal(true)}
              className="text-sm font-semibold text-primary-500 hover:text-primary-700"
            >
              Details
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs">
              Shift Timing: {convertTime(data.start_time)}
            </span>
            <button
              onClick={() => navigate("/messages/" + data.facility.id)}
              className="text-sm font-semibold text-primary-500 hover:text-primary-700"
            >
              Chat
            </button>
          </div>
        </div>
      </div>

      {shiftModal && (
        <ShiftModal
          shiftModal={shiftModal}
          setShiftModal={setShiftModal}
          data={data}
          disableBids
        />
      )}
    </>
  );
};

export default RecentJobCard;
