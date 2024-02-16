import React, { useState } from "react";
import Late from "../../../assets/images/DashboardIcons/late.png";
import CheckIn from "../../../assets/images/DashboardIcons/checkin.png";
import CheckOut from "../../../assets/images/DashboardIcons/checkout.png";
import CheckDetailsModal from "../../Modals/Facility/CheckDetailsModal";

const AllChecksCard = (data) => {
  const [checkModal, setCheckModal] = useState(false);

  const { job_status, user, created_at } = data;
  const { first_name, last_name, country } = user;
  const Icon =
    job_status === null ? Late : job_status === "CheckOut" ? CheckOut : CheckIn;

  return (
    <>
      <button
        onClick={() => setCheckModal(true)}
        className="flex items-center justify-between p-2 my-1 border rounded-md hover:bg-gray-100 bg-gray-50"
      >
        <div className="flex items-center space-x-2">
          <img src={Icon} alt="icon" className="size-9" />
          <div>
            <p className="text-sm font-semibold capitalize">
              {first_name} {last_name}
            </p>
            <p className="text-xs text-gray-500">{country}</p>
          </div>
        </div>

        <span className="mr-2 text-xs">{new Date(created_at).toLocaleString()}</span>
      </button>
      <CheckDetailsModal
        checkModal={checkModal}
        setCheckModal={setCheckModal}
        data={data}
      />
    </>
  );
};

export default AllChecksCard;
