import { useState } from "react";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { FaLocationDot } from "react-icons/fa6";
import { CiClock1 } from "react-icons/ci";

import { convertTime } from "@/utils";
import { ShiftModal } from "@/components";

const ApprovedShiftCard = (data) => {
  const [shiftModal, setShiftModal] = useState(false);

  const facility = data.facility;

  console.log("data", data);

  return (
    <>
      <button onClick={() => setShiftModal(true)} className="relative w-full p-2 bg-gray-50 hover:bg-gray-100/90 transition border rounded-md">
        {/* Shift Info */}
        <div className="flex items-center justify-between p-1">
          <div className="flex items-center">
            {facility?.profile_image ? (
              <img
                src={facility?.profile_image}
                className="rounded-md w-11 h-11"
                alt="facility profile"
              />
            ) : (
              <div className="flex items-center justify-center bg-gray-200 rounded-md size-11">
                <HiMiniBuildingOffice className="text-2xl text-gray-400" />
              </div>
            )}

            <p className="flex flex-col items-start ml-2">
              <span className="text-sm font-semibold">
                {facility.facility_name}
              </span>
            </p>
          </div>
        </div>
        <hr className="my-3"/>
        <div className="text-gray-600 text-start">
          <div className="flex items-center justify-between text-xs">
            <div>
              <FaLocationDot className="inline mr-1 text-base"/>
              <span>{data.state}, {data.country}</span>
            </div>
            <div>
              <CiClock1 className="inline mr-1 text-base"/>
              <span>{new Date(data.created_at).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col mt-3 text-xs">
            <span>Shift Date: {data.opening_date}</span>
            <span>Shift Timing: {convertTime(data.start_time)}</span>
          </div>
        </div>
      </button>

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

export default ApprovedShiftCard;
