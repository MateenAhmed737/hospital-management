import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { VscClose } from "react-icons/vsc";
import { base_url } from "../../../utils/url";
import Button from "../../Buttons/Button";
import { convertTime } from "../../../utils";
import { FaRegStar, FaStar } from "react-icons/fa";

const storeReview = `${base_url}/store-review`;

const CheckDetailsModal = ({ checkModal, setCheckModal, data, setData }) => {
  const [reviewModal, setReviewModal] = useState(false);

  console.log("data", data);

  const close = () => setCheckModal(false);

  const styles = {
    modal: {
      base: "fixed inset-0 !mt-0 flex justify-center items-center bg-black bg-opacity-50 z-50 transition-opacity px-5",
      open: checkModal
        ? "opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none",
    },
    content: "bg-white rounded-md w-full max-w-md",
    header: "flex justify-between items-center py-2 px-4 border-b",
    main: {
      base: "p-4 overflow-y-auto max-h-[70vh]",
      grid: `grid grid-cols-1 gap-4`,
    },
    footer: "flex py-3 px-4 border-t justify-evenly space-x-3",
    closeButton:
      "text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-base p-1.5 ml-auto inline-flex items-center",
    input:
      "min-h-[37px] w-[300px] shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500/50 focus:border-blue-600 block p-2.5",
    boostBtn: `!w-5/6 !rounded-md !py-2.5`,
    deleteBtn: `!size-9 !rounded-md !p-0 !bg-red-500 hover:!bg-red-600 !ring-red-200`,
    editBtn: `!size-9 !rounded-md !p-0 !bg-primary-500 hover:!bg-primary-600 !ring-primary-100`,
    footerCloseButton: `!w-full !rounded-md !py-2.5`,
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };
  const currentStatus = data.job_status || "-";
  const checkInTime = data.check_in_time
    ? new Date(data.check_in_time).toLocaleString()
    : "-";
  const checkOutTime = data.check_out_time
    ? new Date(data.check_out_time).toLocaleString()
    : "-";

  return (
    <div
      className={`${styles.modal.base} ${styles.modal.open}`}
      onClick={handleBackdropClick}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className="text-lg font-semibold">Check Details</h2>
          <button onClick={close} className={styles.closeButton}>
            <VscClose />
          </button>
        </div>
        <div
          className={`${styles.main.base} ${styles.main.grid} ${styles.main.gap} text-center`}
        >
          <img
            src={data.user.profile_image}
            className="w-[100px] h-[100px] object-cover object-center mx-auto rounded-full"
            alt="profile"
          />
          <span className="font-semibold capitalize">
            {data.user.first_name} {data.user.last_name}
          </span>

          <table className="w-full -mt-2 overflow-hidden rounded-lg">
            <tbody>
              <tr className="text-sm text-left bg-gray-50 hover:bg-gray-200">
                <th className="px-2 py-1.5 font-semibold">Job Title:</th>
                <td className="text-xs text-gray-700">{data.shift.title}</td>
              </tr>
              <tr className="text-sm text-left bg-gray-50 hover:bg-gray-200">
                <th className="px-2 py-1.5 font-semibold">Start time:</th>
                <td className="text-xs text-gray-700">
                  {convertTime(data.shift.start_time)}
                </td>
              </tr>
              <tr className="text-sm text-left bg-gray-50 hover:bg-gray-200">
                <th className="px-2 py-1.5 font-semibold">End time:</th>
                <td className="text-xs text-gray-700">
                  {convertTime(data.shift.end_time)}
                </td>
              </tr>
              <tr className="text-sm text-left bg-gray-50 hover:bg-gray-200">
                <th className="px-2 py-1.5 font-semibold">Current Status:</th>
                <td className="text-xs text-gray-700">{currentStatus}</td>
              </tr>
              <tr className="text-sm text-left bg-gray-50 hover:bg-gray-200">
                <th className="px-2 py-1.5 font-semibold">Check in time:</th>
                <td className="text-xs text-gray-700">{checkInTime}</td>
              </tr>
              <tr className="text-sm text-left bg-gray-50 hover:bg-gray-200">
                <th className="px-2 py-1.5 font-semibold">Check out time:</th>
                <td className="text-xs text-gray-700">{checkOutTime}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.footer}>
          {data.job_status === null && data.review === null ? (
            <Button
              title="Write Review"
              handleClick={() => setReviewModal(true)}
              extraStyles={styles.footerCloseButton}
            />
          ) : (
            <Button
              title="Close"
              handleClick={close}
              extraStyles={styles.footerCloseButton}
            />
          )}
        </div>
      </div>

      {reviewModal && (
        <ReviewModal
          reviewModal={reviewModal}
          setReviewModal={setReviewModal}
          setData={setData}
          data={data}
        />
      )}
    </div>
  );
};

const ReviewModal = ({ reviewModal, setReviewModal, setData, data }) => {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("0");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  const userName = `${data.user.first_name} ${data.user.last_name}`;
  console.log("data", data);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formdata = new FormData();
    formdata.append("content", review);
    formdata.append("stars", rating);
    formdata.append("recommend", recommendation);
    formdata.append("shift_id", data.shift.id);

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formdata,
      redirect: "follow",
    };

    fetch(`${storeReview}/${data.user.id}`, requestOptions)
      .then((res) => res.json())
      .then((json) => {
        console.log("res", json);
        if (json.success) {
          toast.success("Review submited!");
          setData((prev) =>
            prev.map((e) => (e.id === data.id ? { ...e, review: true } : e))
          );
          close();
        } else if (json?.errors || json?.error) {
          toast.error(json?.errors?.[0] || json?.error?.message);
        }
      })
      .catch((error) => toast.error(error?.[0]?.message || error?.message))
      .finally(() => setLoading(false));
  };

  const styles = {
    modal: {
      base: "fixed inset-0 !mt-0 flex justify-center items-center bg-black bg-opacity-50 z-50 transition-opacity px-5",
      open: reviewModal
        ? "opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none",
    },
    content: "bg-white rounded-md w-full max-w-md",
    header: "flex justify-between items-center py-2 px-4 border-b",
    main: {
      base: "p-4 overflow-y-auto max-h-[70vh]",
      grid: `grid grid-cols-1 gap-2`,
    },
    footer: "flex py-3 px-4 border-t justify-evenly space-x-3",
    closeButton:
      "text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-base p-1.5 ml-auto inline-flex items-center",
    input:
      "min-h-[37px] w-[300px] shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500/50 focus:border-blue-600 block p-2.5",
    createButton: `!w-full !rounded-md ${loading ? "!py-2" : "!py-3"}`,
  };

  const close = () => setReviewModal(false);
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  return (
    <div
      className={`${styles.modal.base} ${styles.modal.open}`}
      onClick={handleBackdropClick}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className="text-lg font-semibold">Write Review</h2>
          <button onClick={close} className={styles.closeButton}>
            <VscClose />
          </button>
        </div>
        <div
          className={`${styles.main.base} ${styles.main.grid} ${styles.main.gap} text-sm`}
        >
          <div className="text-center">
            <p className="font-medium">
              How was your experience with {userName}?
            </p>

            <div className="my-2 space-x-2 text-xl text-primary-500">
              {new Array(5).fill(0).map((_, index) => (
                <button onClick={() => setRating(index + 1)}>
                  {index >= rating ? <FaRegStar /> : <FaStar />}
                </button>
              ))}
            </div>

            <img
              src={data.user.profile_image}
              alt="profile"
              className="object-cover object-center mx-auto rounded-full size-24"
            />
          </div>

          <div>
            <label htmlFor="review" className="font-medium">
              Write your review
            </label>
            <textarea
              id="review"
              rows={8}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full p-2 my-2 transition-all duration-200 bg-gray-100 border border-gray-300 rounded-md outline-none focus:border-primary-500"
              placeholder="Write review here..."
            />
          </div>

          <div>
            <p className="font-medium">
              Would you recommend {userName} to your friend?
            </p>
            {/* Radio Btns (Yes or No) */}
            <div className="flex items-center justify-between w-1/2 mt-2">
              <label>
                <input
                  className="relative top-0.5"
                  id="yes"
                  type="radio"
                  name="recommendation"
                  onChange={(e) => setRecommendation(e.target.value)}
                  value="1"
                />{" "}
                Yes
              </label>
              <label>
                <input
                  className="relative top-0.5"
                  id="no"
                  type="radio"
                  name="recommendation"
                  onChange={(e) => setRecommendation(e.target.value)}
                  value="0"
                />{" "}
                No
              </label>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <Button
            title="Close"
            handleClick={close}
            extraStyles={styles.createButton}
          />
          <Button
            title="Submit"
            handleClick={handleSubmit}
            extraStyles={styles.createButton}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckDetailsModal;
