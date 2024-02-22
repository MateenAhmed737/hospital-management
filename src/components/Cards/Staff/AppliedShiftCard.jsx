import React, { useState } from "react";
import { ShiftModal } from "../../Modals";
import { convertTime } from "../../../utils";
import { useNavigate } from "react-router-dom";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import toast from "react-hot-toast";
import { base_url } from "../../../utils/url";

const bookmark = `${base_url}/book-marked-shifts`;

const AppliedShiftCard = (data) => {
  const navigate = useNavigate();
  const [shiftModal, setShiftModal] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  const handleBookmark = () => {
    setBookmarking(true);

    const formdata = new FormData();
    formdata.append("user_id", data?.user?.id);
    fetch(`${bookmark}/${data.id}`, {
      method: "POST",
      body: formdata,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("res", res);
        if (res.status === 200) {
          data.setUserBookmarks &&
            data.setUserBookmarks((prev) =>
              data.isBookmarked
                ? prev.filter((e) => e != res.data.shift_id)
                : [...prev, Number(res.data.shift_id)]
            );
          data.onSuccess && data.onSuccess();
          toast.success(res.message, { duration: 2000 });
        } else if (res.error) {
          toast.error(res?.error?.message);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setBookmarking(true);
      });
  };

  return (
    <>
      <div className="relative p-2 py-1.5 bg-gray-100 border rounded-md">
        {/* Bookmark Button */}
        {data.enableBookmarks && (
          <button
            className="absolute text-primary-500 top-2 right-2"
            onClick={handleBookmark}
            disabled={bookmarking}
          >
            {data.isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
          </button>
        )}

        {/* Shift Info */}
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
          <div className="flex flex-col items-end text-sm font-semibold text-primary-500">
            <span>${Number(data?.total_service_amount || 0).toFixed(2)}</span>
            <sub>EST AMT</sub>
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

export default AppliedShiftCard;
