import React, { useState } from "react";
import { ShiftModal } from "../../Modals";
import { convertTime } from "../../../utils";

const JobCard = ({
  data,
  title,
  shift,
  facility,
  opening_date,
  disableBids = false,
  isTodaysShift = false,
  setTodayJob
}) => {
  const [shiftModal, setShiftModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShiftModal(true)}
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
        <span className="text-xs">
          {convertTime(new Date(data.created_at).toLocaleTimeString())}
        </span>
      </button>
      {shiftModal && (
        <ShiftModal
          shiftModal={shiftModal}
          setShiftModal={setShiftModal}
          data={{ ...data, ...shift, facility }}
          disableBids={disableBids}
          isTodaysShift={isTodaysShift}
          setTodayJob={setTodayJob}
        />
      )}
    </>
  );
};

export default JobCard;