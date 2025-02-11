import { useState } from "react";
import { ShiftModal } from "../../Modals";
import moment from "moment";

const JobCard = ({
  data,
  shift,
  facility,
  disableBids = false,
  isTodaysShift = false,
  setTodayJob,
  modalTitle,
}) => {
  const [shiftModal, setShiftModal] = useState(false);

  // console.log('data >>>>', data)

  return (
    <>
      <button
        onClick={() => setShiftModal(true)}
        className="flex items-center justify-between p-1 pr-3 bg-gray-100 rounded-md hover:bg-gray-200"
      >
        <div className="flex items-center">
          <img
            src={facility?.profile_image}
            className="rounded-md w-11 h-11 aspect-square object-cover"
            alt="facility profile"
          />

          <p className="flex flex-col items-start ml-2">
            <span className="text-sm font-semibold">
              {facility?.facility_name}
            </span>
            <span className="mt-1 text-xs">
              {shift?.state}, {shift?.country}
            </span>
          </p>
        </div>
        <span className="text-xs">
          {moment(shift?.created_at).format("LT")}
        </span>
      </button>
      {shiftModal && (
        <ShiftModal
          shiftModal={shiftModal}
          setShiftModal={setShiftModal}
          data={{
            facility,
            id: data?.shift_id,
            job_status: data?.job_status,
            break_status: data?.break_status,
          }}
          disableBids={disableBids}
          isTodaysShift={isTodaysShift}
          setTodayJob={setTodayJob}
          modalTitle={modalTitle}
        />
      )}
    </>
  );
};

export default JobCard;
