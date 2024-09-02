import { useState } from "react";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { IoCheckmarkDoneSharp, IoCheckmarkSharp } from "react-icons/io5";
import { MdOutlinePendingActions } from "react-icons/md";
import { useSelector } from "react-redux";
import { base_url } from "../../utils/url";
import { FaCircleCheck } from "react-icons/fa6";
import { cn } from "../../lib/utils";
import MarkInvoiceModal from "../Modals/Admin/MarkInvoiceModal";
import { formatNumbers } from "../../utils";

const markInvoiceUrl = `${base_url}/mark-invoice/`;

const InvoiceCard = ({ invoice, onClick, reload }) => {
  const [markInvoiceModal, setMarkInvoiceModal] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const user = useSelector((state) => state.user);

  const isPaid = invoice.status.toLowerCase() === "paid";
  const isUnpaid = invoice.status.toLowerCase() === "unpaid";
  const color = isPaid ? "text-green-600" : isUnpaid ? "text-red-600" : "";

  const isByAdmin = invoice?.invoice_by === "Admin";
  const fcData = invoice?.facility;
  const profileImage = fcData?.profile_image;
  console.log("data invoice card", invoice);

  return (
    <>
      <button
        onClick={hasEntered ? undefined : onClick}
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
          <p className="flex flex-col items-start">
            <span className="text-sm font-medium">
              {isByAdmin ? invoice?.company : fcData?.facility_name}
            </span>
            <span className="text-[11px] text-gray-400">{invoice.due_date}</span>
            <span className="text-xs text-gray-400">{fcData?.state + ", " + fcData?.country}</span>
          </p>
        </div>

        <p className="flex flex-col items-end space-y-0.5">
          <div className={color + " flex items-center space-x-1"}>
            {user.isAdmin && !isPaid && (
              <button
                onClick={() => setMarkInvoiceModal(true)}
                onMouseEnter={() => setHasEntered(true)}
                onMouseLeave={() => setHasEntered(false)}
                className={cn(
                  "inline-block text-primary-600 hover:text-primary-700 disabled:hover:text-inherit",
                  color
                )}
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
            <span className="text-xs">{invoice.status}</span>
          </div>
          <span className="text-sm">
            {formatNumbers(invoice.total_amount || invoice?.amount || 0, "currency")}
          </span>
        </p>
      </button>
      <MarkInvoiceModal
        markInvoiceModal={markInvoiceModal}
        setMarkInvoiceModal={setMarkInvoiceModal}
        markInvoiceUrl={markInvoiceUrl}
        data={invoice}
        reload={reload}
      />
    </>
  );
};

export default InvoiceCard;
