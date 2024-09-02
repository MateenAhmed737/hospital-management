import toast from "react-hot-toast";
import { useState } from "react";

// Icons
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

import { ShiftModal } from "@/components/Modals";
import { convertTime } from "@/utils";
import { base_url } from "@/utils/url";

const bookmark = `${base_url}/book-marked-shifts`;

const AppliedShiftCard = (data) => {
  const [shiftModal, setShiftModal] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  console.log("data", data);

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
              <span className="font-semibold">{data.title}</span>
              <span className="text-xs font-medium text-gray-600">
                {data.facility.facility_name}, {data.state}, {data.country}
              </span>
            </p>
          </div>
          <div className="flex flex-col items-end text-sm font-semibold text-gray-500 pt-2">
            <span>USD {Number(data?.service_amount || 0)}/hr</span>
          </div>
        </div>
        <div className="w-full h-px my-1 bg-gray-300" />
        <div className="text-xs">
          <span>{data.description}</span>

          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start justify-between mt-3">
              <span>Shift Date: {data.opening_date}</span>
              <span>
                Shift Timing: {convertTime(data.start_time)} to{" "}
                {convertTime(data.end_time)}
              </span>
            </div>
            <button className="text-sm font-semibold text-primary-400 hover:text-primary-500" onClick={() => setShiftModal(true)}>Details</button>
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
