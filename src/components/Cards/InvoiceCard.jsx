import React, { useState } from "react";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { IoCheckmarkDoneSharp, IoCheckmarkSharp } from "react-icons/io5";
import { MdOutlinePendingActions } from "react-icons/md";
import { useSelector } from "react-redux";
import { base_url } from "../../utils/url";
import MarkInvoiceModal from "../Modals/Admin/MarkInvoiceModal";
import { FaCircleCheck } from "react-icons/fa6";

const markInvoiceUrl = `${base_url}/mark-invoice/`;

const InvoiceCard = (data) => {
  const [markInvoiceModal, setMarkInvoiceModal] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const user = useSelector((state) => state.user);

  const isPaid = data.status.toLowerCase() === "paid";
  const isUnpaid = data.status.toLowerCase() === "unpaid";
  const isPending = data.status.toLowerCase() === "pending";
  const color = isPaid ? "text-green-600" : isUnpaid ? "text-red-600" : "";

  const isByAdmin = data?.invoice_by === "Admin";
  const fcData = data?.[user.isAdmin ? "user" : "facility"];
  const profileImage = fcData?.profile_image;

  return (
    <>
      <button
        onClick={hasEntered ? undefined : data?.onClick}
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
            <span className="text-sm font-medium">
              {isByAdmin ? data?.company : fcData?.facility_name}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(data.created_at).toLocaleString()}
            </span>
          </p>
        </div>

        <p className="flex flex-col items-end space-y-0.5">
          <div className={color + " flex items-center space-x-1"}>
            {user.isAdmin && !isPaid && (
              <button
                onClick={() => setMarkInvoiceModal(true)}
                onMouseEnter={() => setHasEntered(true)}
                onMouseLeave={() => setHasEntered(false)}
                className={`inline-block text-primary-600 hover:text-primary-700 disabled:hover:text-inherit ${color}`}
                title="Mark Paid"
              >
                <FaCircleCheck />
              </button>
            )}
            {isPaid ? (
              <IoCheckmarkDoneSharp />
            ) : isUnpaid ? (
              <IoCheckmarkSharp />
            ) : (
              <MdOutlinePendingActions />
            )}
            <span className={`text-xs`}>{data.status}</span>
          </div>
          <span className="text-sm">
            ${Number(data.total_amount || data?.amount || 0).toFixed(2)}
          </span>
        </p>
      </button>
      <MarkInvoiceModal
        markInvoiceModal={markInvoiceModal}
        setMarkInvoiceModal={setMarkInvoiceModal}
        markInvoiceUrl={markInvoiceUrl}
        data={data}
        reload={data?.reload}
      />
    </>
  );
};

export default InvoiceCard;
