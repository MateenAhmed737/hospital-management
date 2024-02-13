import { toast } from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";
import Button from "../Buttons/Button";
import { PiMapPinDuotone } from "react-icons/pi";
import { convertTime } from "../../utils";
import { base_url } from "../../utils/url";
import { Loader } from "../Loaders";
import Empty from "../Empty";
import { useSelector } from "react-redux";

const getBitData = `${base_url}/get-bits-users`;
const storeBid = `${base_url}/store-bit`;

const ShiftModal = ({
  shiftModal,
  setShiftModal,
  data,
  disableBids,
  isTodaysShift,
  setTodayJob
}) => {
  const [tab, setTab] = useState(0);
  const [placeBidsModal, setPlaceBidsModal] = useState(false);
  const [viewOtherBids, setViewOtherBids] = useState(false);
  const [status, setStatus] = useState(
    data?.job_status !== "CheckIn" ? "Check in" : "CheckOut"
  );
  const [loading, setLoading] = useState(false);
  const facility = data.facility;

  console.log("data", data);

  const close = () => setShiftModal(false);

  const styles = {
    modal: {
      base: "fixed inset-0 !mt-0 flex justify-center items-center bg-black bg-opacity-50 z-50 transition-opacity px-5",
      open: shiftModal
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
    createButton: `!w-1/2 !rounded-md !py-2.5`,
    footerCloseButton: `!w-full !rounded-md !py-2.5`,
  };

  const handleCheck = async () => {
    setLoading(true);
    try {
      const url = `${base_url}/user-job-status/${data.id}`;
      const formdata = new FormData();

      formdata.append("status", status);

      const res = await fetch(url, {
        method: "post",
        body: formdata,
      });
      if (res.status) {
        setTodayJob((prev) => ({ ...prev, reload: true }));
        toast.success("Check in successful!");
        close();
      } else {
        toast.error("Try again later!");
      }
    } catch (error) {
      toast.error("Server side Error");
      console.error("check_job_status catch error", error);
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="text-lg font-semibold">Shift Details</h2>
          <button onClick={close} className={styles.closeButton}>
            <VscClose />
          </button>
        </div>
        <div
          className={`${styles.main.base} ${styles.main.grid} ${styles.main.gap} text-center`}
        >
          <img
            src={facility.profile_image}
            className="w-[100px] h-[100px] object-cover object-center mx-auto rounded-full"
            alt={facility.facility_name}
          />
          <p className="font-semibold">
            <span>{facility.facility_name}</span>

            <div>
              <PiMapPinDuotone className="inline text-gray-800" />
              <span className="text-xs font-normal text-gray-600">
                {facility.country}
              </span>
            </div>
          </p>

          <div className="flex w-full">
            <button
              onClick={() => setTab(0)}
              className={`w-1/2 py-3 text-xs font-medium border-b-2 ${
                tab === 0
                  ? "text-primary-600 border-primary-600"
                  : "text-gray-500"
              }`}
            >
              Bids Detail
            </button>
            <button
              onClick={() => setTab(1)}
              className={`w-1/2 py-3 text-xs font-medium border-b-2 ${
                tab === 1
                  ? "text-primary-600 border-primary-600"
                  : "text-gray-500"
              }`}
            >
              Job Detail
            </button>
          </div>
          {tab === 0 && (
            <table className="w-full -mt-2 overflow-hidden rounded-lg">
              <tbody>
                <tr className="text-sm text-left bg-gray-50 hover:bg-gray-200">
                  <th className="px-2 py-1.5 font-semibold">Start time:</th>
                  <td className="text-xs text-gray-700">
                    {convertTime(data.start_time)}
                  </td>
                </tr>
                <tr className="text-sm text-left bg-gray-50 hover:bg-gray-200">
                  <th className="px-2 py-1.5 font-semibold">End time:</th>
                  <td className="text-xs text-gray-700">
                    {convertTime(data.end_time)}
                  </td>
                </tr>
                <tr className="text-sm text-left bg-gray-50 hover:bg-gray-200">
                  <th className="px-2 py-1.5 font-semibold">Opening date:</th>
                  <td className="text-xs text-gray-700">{data.opening_date}</td>
                </tr>
                <tr className="text-sm text-left bg-gray-50 hover:bg-gray-200">
                  <th className="px-2 py-1.5 font-semibold">Job created:</th>
                  <td className="text-xs text-gray-700">
                    {new Date(data.created_at).toLocaleString()}
                  </td>
                </tr>
                <tr className="text-sm text-left bg-gray-50 hover:bg-gray-200">
                  <th className="px-2 py-1.5 font-semibold">Service type:</th>
                  <td className="text-xs text-gray-700">{data.service_type}</td>
                </tr>
              </tbody>
            </table>
          )}
          {tab === 1 && (
            <div className="-mt-2 text-xs text-left">
              <p className="text-sm font-semibold">
                {data.service_amount}/hr USD
              </p>
              <p className="mt-2 text-sm font-medium text-gray-800">
                {data.title}
              </p>
              <p className="text-gray-600">{data.description}</p>

              <p className="mt-4 text-sm font-semibold">Job Detail</p>
              {data.job_details.map((item) => (
                // use summary tag
                <details className="mt-1.5 mb-3">
                  <summary className="font-semibold text-gray-900">
                    {item.subject}
                  </summary>
                  <p className="mt-1 ml-4 text-gray-600">{item.detail}</p>
                </details>
              ))}
            </div>
          )}
        </div>
        <div className={styles.footer}>
          {isTodaysShift ? (
            <Button
              title={(() => {
                const sp = status.split("");
                sp.splice(5, 0, " ");
                return sp;
              })()}
              loading={loading}
              handleClick={handleCheck}
              extraStyles={styles.footerCloseButton}
            />
          ) : disableBids ? (
            <Button
              title="Close"
              handleClick={close}
              extraStyles={styles.footerCloseButton}
            />
          ) : (
            <>
              <button
                onClick={() => setViewOtherBids(true)}
                className="mx-auto text-xs text-gray-600 hover:underline"
              >
                View other bids
              </button>
              <Button
                title="Place Bids"
                handleClick={() => setPlaceBidsModal(true)}
                extraStyles={styles.createButton}
              />
            </>
          )}
        </div>
      </div>

      <PlaceBidsModal
        placeBidsModal={placeBidsModal}
        setPlaceBidsModal={setPlaceBidsModal}
        data={data}
      />

      <ViewOtherBidsModal
        viewOtherBids={viewOtherBids}
        setViewOtherBids={setViewOtherBids}
        data={data}
      />
    </div>
  );
};

const PlaceBidsModal = ({ placeBidsModal, setPlaceBidsModal, data }) => {
  const user = useSelector((state) => state.user);
  const [bid, setBid] = useState(0.0);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const facility = data.facility;

  console.log("data", data);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formdata = new FormData();
    formdata.append("price", bid);
    formdata.append("description", description);

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formdata,
      redirect: "follow",
    };

    fetch(`${storeBid}/${user.id}/${data.id}`, requestOptions)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          toast.success("Bid placed successfully!");
          setBid(0.0);
          setDescription("");
          setPlaceBidsModal(false);
        } else if (json?.message?.includes("Bit already exists")) {
          toast.error("Bid already exists.");
          setBid(0.0);
          setDescription("");
          setPlaceBidsModal(false);
        } else if (json?.error) {
          toast.error(json?.error?.[0]?.message || json?.error?.message);
        }
      })
      .catch((error) => toast.error(error?.[0]?.message || error?.message))
      .finally(() => setLoading(false));
  };

  const close = () => setPlaceBidsModal(false);

  const styles = {
    modal: {
      base: "fixed inset-0 !mt-0 flex justify-center items-center bg-black bg-opacity-50 z-50 transition-opacity px-5",
      open: placeBidsModal
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
      <form onSubmit={handleSubmit} className={styles.content}>
        <div className={styles.header}>
          <h2 className="text-lg font-semibold">Place Your Bid</h2>
          <button onClick={close} className={styles.closeButton}>
            <VscClose />
          </button>
        </div>
        <div
          className={`${styles.main.base} ${styles.main.grid} ${styles.main.gap} text-center`}
        >
          <img
            src={facility.profile_image}
            className="w-[80px] h-[80px] object-cover object-center mx-auto rounded-full"
            alt={facility.facility_name}
          />
          <p className="font-semibold">
            <span>{facility.facility_name}</span>

            <div>
              <PiMapPinDuotone className="inline text-gray-800" />
              <span className="text-xs font-normal text-gray-600">
                {facility.country}
              </span>
            </div>
          </p>

          <b>${bid}</b>
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={bid}
            onChange={(e) => setBid(e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            required
          />

          <div className="flex flex-col items-start">
            <br />
            <label
              htmlFor="description"
              className="block mb-2 text-xs font-medium text-gray-900 capitalize"
            >
              Description
            </label>
            <textarea
              rows={8}
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
              placeholder="Write description here..."
              required
            />
          </div>
        </div>
        <div className={styles.footer}>
          <Button
            type="submit"
            title="Bid This Job"
            extraStyles={styles.createButton}
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
};

const ViewOtherBidsModal = ({ viewOtherBids, setViewOtherBids, data }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const facility = data.facility;

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const close = () => setViewOtherBids(false);

  const styles = {
    modal: {
      base: "fixed inset-0 !mt-0 flex justify-center items-center bg-black bg-opacity-50 z-50 transition-opacity px-5",
      open: viewOtherBids
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
    createButton: `!w-full !rounded-md !py-2.5`,
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  useEffect(() => {
    if (viewOtherBids) {
      const fetchBids = () => {
        setLoading(true);

        fetch(`${getBitData}/${data.id}`)
          .then((res) => res.json())
          .then((json) => {
            if (json.success) {
              const data = json.success.data || [];
              console.log("data", data);
              setBids(data);
            }
          })
          .catch((error) => console.error(error))
          .finally(() => setLoading(false));
      };

      fetchBids();
    }
  }, [data.id, viewOtherBids]);

  return (
    <div
      className={`${styles.modal.base} ${styles.modal.open}`}
      onClick={handleBackdropClick}
    >
      <form onSubmit={handleSubmit} className={styles.content}>
        <div className={styles.header}>
          <h2 className="text-lg font-semibold">View other bids</h2>
          <button onClick={close} className={styles.closeButton}>
            <VscClose />
          </button>
        </div>
        <div
          className={`${styles.main.base} ${styles.main.grid} ${styles.main.gap} text-center`}
        >
          <img
            src={facility.profile_image}
            className="w-[80px] h-[80px] object-cover object-center mx-auto rounded-full"
            alt={facility.facility_name}
          />
          <p className="font-semibold">
            <span>{facility.facility_name}</span>

            <div>
              <PiMapPinDuotone className="inline text-gray-800" />
              <span className="text-xs font-normal text-gray-600">
                {facility.country}
              </span>
            </div>
          </p>

          <div className="flex justify-between w-full mt-2 text-sm">
            <span>All results</span>
            <span>{bids.length} bits found</span>
          </div>
          <div
            className={
              "relative flex flex-col min-h-[150px] " +
              (loading ? "items-center justify-center" : "justify-start")
            }
          >
            {loading ? (
              <Loader />
            ) : bids.length ? (
              bids.map((item) => (
                <div className="flex items-center w-full mt-3 space-x-2">
                  <img
                    src={item.profile_image}
                    className="w-[40px] h-[40px] object-cover object-center rounded-full"
                    alt="profile"
                  />
                  <div className="w-11/12">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800 capitalize">
                        {item.user_name}
                      </span>
                      <span className="text-sm font-medium text-gray-800 capitalize">
                        ${item.price}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        {item.description}
                      </span>
                      <span className="text-xs text-gray-600">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <Empty title="No bids found!" noMargin />
            )}
          </div>
        </div>
        <div className={styles.footer}>
          <Button
            title="Close"
            handleClick={close}
            extraStyles={styles.createButton}
          />
        </div>
      </form>
    </div>
  );
};

export default ShiftModal;
