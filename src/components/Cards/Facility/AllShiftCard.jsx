import React, { useState } from "react";
import { FacilityShiftModal } from "../../Modals/Facility";
import { convertTime } from "../../../utils";
import { BoostShiftModal } from "../../Modals/Facility/FacilityShiftModal";

const AllShiftCard = ({
  data,
  title,
  opening_date,
  disableBids = false,
  disableDetail = false,
  setData,
  enableBoost = false,
}) => {
  const [shiftModal, setShiftModal] = useState(false);
  const [boostModal, setBoostModal] = useState(false);

  const canBoostShift = enableBoost && data?.boost_status === "No";

  return (
    <>
      <div className="p-2 py-1.5 bg-gray-100 border rounded-md">
        <div className="flex items-center justify-between p-1">
          <div className="flex items-center">
            <img
              src={data.profile_image}
              className="rounded-md w-11 h-11"
              alt="facility profile"
            />

            <p className="flex flex-col items-start ml-2">
              <span className="text-sm font-semibold">{data.title}</span>
            </p>
          </div>
          <span className="text-sm font-semibold text-primary-500">
            ${Number(data.total_service_amount || 0).toFixed(2)}
          </span>
        </div>
        <div className="w-full h-px my-1 bg-gray-300" />
        <div className="">
          <span className="text-xs">{data.description}</span>

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs">Shift Date: {data.opening_date}</span>
            {!disableDetail && (
              <button
                onClick={() => setShiftModal(true)}
                className="text-sm font-semibold text-primary-500 hover:text-primary-700"
              >
                Details
              </button>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs">
              Shift Timing: {convertTime(data.start_time)}
            </span>
            {canBoostShift && (
              <button
                onClick={() => setBoostModal(true)}
                className="text-sm font-semibold text-primary-500 hover:text-primary-700"
              >
                Boost your job
              </button>
            )}
          </div>
        </div>
      </div>
      {shiftModal && (
        <FacilityShiftModal
          shiftModal={shiftModal}
          setShiftModal={setShiftModal}
          disableBids={disableBids}
          data={data}
          setData={setData}
        />
      )}
      {canBoostShift && boostModal && (
        <BoostShiftModal
          boostModal={boostModal}
          setBoostModal={setBoostModal}
          data={data}
        />
      )}
    </>
  );
};

export default AllShiftCard;
