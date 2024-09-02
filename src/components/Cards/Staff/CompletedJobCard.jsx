import { useState } from "react";

import { ShiftModal } from "@/components/Modals";
import { convertTime } from "@/utils";

const CompletedJobCard = (data) => {
  const [shiftModal, setShiftModal] = useState(false);

  return (
    <>
      <div className="p-2 py-1.5 bg-gray-100 border rounded-md">
        <div className="flex items-center justify-between p-1">
          <div className="flex items-center">
            <img
              src={data.facility.profile_image}
              className="rounded-md w-11 h-11"
              alt="facility profile"
            />

            <p className="flex flex-col items-start ml-2">
              <span className="font-semibold">{data.title}</span>
              <span className="text-xs font-medium text-gray-600">{data.facility.facility_name}</span>
            </p>
          </div>
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
              Shift Timing: {convertTime(data.start_time)} {convertTime(data.end_time)}
            </span>
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

export default CompletedJobCard;
