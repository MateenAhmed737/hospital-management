import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";
import Button from "../../Buttons/Button";
import { PiMapPinDuotone } from "react-icons/pi";
import { parseJson } from "../../../utils";
import { base_url } from "../../../utils/url";
import { Loader } from "../../Loaders";
import Empty from "../../Empty";
import { useSelector } from "react-redux";
import { MdChat, MdEdit } from "react-icons/md";
import { ImBin } from "react-icons/im";
import { DropdownField } from "../../Fields";
import { formatNumbers } from "../../../utils";
import moment from "moment";
import { Link } from "react-router-dom";
import { FaRegStar, FaStar } from "react-icons/fa";
import ProfileViewModal from "../ProfileViewModal";

const getShift = `${base_url}/get-single-shift`;
const getBitData = `${base_url}/get_bitdata`;
const acceptBid = `${base_url}/confirmed-shifts`;
const shiftBoost = `${base_url}/shift-boost/`;
const deleteShift = `${base_url}/delete-shifts/`;
const editShift = `${base_url}/edit-shift/`;
const getServiceTypes = `${base_url}/get-services`;

const FacilityShiftModal = ({
  shiftModal,
  setShiftModal,
  disableBids,
  setData,
  data,
}) => {
  const [tab, setTab] = useState(0);
  const [shift, setShift] = useState({ data: null, loading: true });
  const [bids, setBids] = useState({ data: [], loading: false });
  const [bidsModal, setBidsModal] = useState({ isOpen: false, data: null });
  const [profileModal, setProfileModal] = useState({
    isOpen: false,
    user_id: null,
  });
  const [editModal, setEditModal] = useState(false);
  const [boostModal, setBoostModal] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState({ delete: false, edit: false });
  let details = parseJson(data.job_details);

  const isApproved = shift.data?.status === "Approved";

  console.log("shift data ==>", shift.data);

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
    boostBtn: `!w-5/6 !rounded-md !py-2.5`,
    deleteBtn: `!size-9 !rounded-md !p-0 !bg-red-500 hover:!bg-red-600 !ring-red-200`,
    editBtn: `!size-9 !rounded-md !p-0 !bg-primary-500 hover:!bg-primary-600 !ring-primary-100`,
    footerCloseButton: `!w-full !rounded-md !py-2.5`,
  };

  const handleDelete = () => {
    setLoadingBtn((prev) => ({ ...prev, delete: true }));

    fetch(deleteShift + data.id, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      redirect: "follow",
    })
      .then((res) => res.json())
      .then((json) => {
        console.log("json", json);
        if (json.success) {
          toast.success(json.success.message);
          setData((prev) => ({
            ...prev,
            data: prev.data.filter((item) => item.id !== data.id),
          }));
          close();
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setLoadingBtn((prev) => ({ ...prev, delete: false })));
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  useEffect(() => {
    const fetchShift = () => {
      fetch(`${getShift}/${data.id}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            const data = json.success.data || [];
            console.log("shift data", data);
            setShift({ loading: false, data });
          }
        })
        .catch((error) => console.error(error))
        .finally(() => setShift((prev) => ({ ...prev, loading: false })));
    };
    const fetchBids = () => {
      setBids((prev) => ({ ...prev, loading: true }));

      fetch(`${getBitData}/${data.id}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            const data = json.success.data || [];
            console.log("data", data);
            setBids((prev) => ({ ...prev, data }));
          }
        })
        .catch((error) => console.error(error))
        .finally(() => setBids((prev) => ({ ...prev, loading: false })));
    };

    fetchShift();
    fetchBids();
  }, [data]);

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
          className={`${styles.main.base} ${styles.main.grid} ${styles.main.gap} relative min-h-96 text-center`}
        >
          {shift.loading ? (
            <Loader />
          ) : (
            <>
              <img
                src={data?.profile_image}
                className="w-[100px] h-[100px] object-cover object-center mx-auto rounded-full"
                alt={data?.facility_name}
              />
              <p className="font-semibold">
                <span>{data?.facility_name}</span>
                <div>
                  <PiMapPinDuotone className="inline text-gray-800" />
                  <span className="text-xs font-normal text-gray-600">
                    {data?.state}, {data?.country}
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
                  Shift Details
                </button>
                <button
                  onClick={() => setTab(1)}
                  className={`w-1/2 py-3 text-xs font-medium border-b-2 ${
                    tab === 1
                      ? "text-primary-600 border-primary-600"
                      : "text-gray-500"
                  }`}
                >
                  Staff Requests
                </button>
              </div>
              {tab === 0 && (
                <div className="-mt-2 text-xs text-left space-y-2">
                  <p className="text-sm font-medium">
                    Boost Charges:{" "}
                    {formatNumbers(data?.boost_fee || 0, "currency")}
                  </p>
                  <p className="text-sm font-medium">
                    Est Hours: {data?.total_hour} hr
                  </p>
                  <p className="text-gray-600">{data?.description}</p>
                  <p className="!mt-4 text-sm font-semibold">Job Detail</p>
                  {details?.map((item, index) => (
                    <details key={index} className="mt-1.5 mb-3">
                      <summary className="font-semibold text-gray-900">
                        {item.subject}
                      </summary>
                      <p className="mt-1 ml-4 text-gray-600">{item.detail}</p>
                    </details>
                  ))}
                </div>
              )}
              {tab === 1 &&
                (bids.loading ? (
                  <div className="relative w-full min-h-[20vh]">
                    <Loader />
                  </div>
                ) : bids.data.length > 0 ? (
                  bids.data.map((item) => {
                    const averageRating =
                      eval(
                        item.reviews.reduce(
                          (a, e) => (a += Number(e.stars)),
                          0
                        ) / item.reviews.length
                      ) || 0;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                      >
                        <button
                          onClick={() =>
                            setProfileModal({ isOpen: true, ...item })
                          }
                          className="flex items-center space-x-3"
                        >
                          <img
                            src={item.profile_image}
                            alt="profile"
                            className="rounded-md size-12"
                          />
                          <p className="flex flex-col items-start space-y-1 text-gray-700">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-semibold capitalize">
                                {item.user_name}
                              </span>
                              <div className="flex items-center space-x-0.5 text-xs">
                                {new Array(5)
                                  .fill(0)
                                  .map((_, index) =>
                                    index + 1 > averageRating ? (
                                      <FaRegStar
                                        key={index}
                                        className="text-primary-500"
                                      />
                                    ) : (
                                      <FaStar
                                        key={index}
                                        className="text-primary-500"
                                      />
                                    )
                                  )}
                                <span className="text-xs">
                                  ({averageRating.toFixed(1)})
                                </span>
                              </div>
                            </div>
                            <span className="text-xs">{item.description}</span>
                          </p>
                        </button>
                        <button
                          onClick={() =>
                            setBidsModal({ isOpen: true, data: item })
                          }
                          disabled={isApproved}
                          className="px-3 py-1.5 text-xs text-white rounded-md bg-primary-500 hover:bg-primary-600 disabled:bg-primary-200 disabled:hover:bg-primary-200 disabled:cursor-not-allowed"
                          title={isApproved ? "Job already approved!" : ""}
                        >
                          View Bid
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <Empty title="No Staff request yet!" noMargin />
                ))}
            </>
          )}
        </div>
        <div className={styles.footer}>
          {!disableBids ? (
            <>
              <div className="flex items-center space-x-1">
                <Button
                  title={
                    !loadingBtn.delete && (
                      <ImBin className="text-xl text-white" />
                    )
                  }
                  handleClick={handleDelete}
                  extraStyles={styles.deleteBtn}
                  loading={loadingBtn.delete}
                />
                <Button
                  title={
                    !loadingBtn.edit && (
                      <MdEdit className="text-xl text-white" />
                    )
                  }
                  handleClick={() => setEditModal(true)}
                  extraStyles={styles.editBtn}
                  loading={loadingBtn.edit}
                />
              </div>
              <Button
                title="Boost Your Shift"
                handleClick={() =>
                  data.boost_status === "No" && setBoostModal(true)
                }
                extraStyles={styles.boostBtn}
                disabled={data.boost_status === "Yes"}
              />
            </>
          ) : (
            <Button
              title="Close"
              handleClick={close}
              extraStyles={styles.footerCloseButton}
            />
          )}
        </div>
      </div>

      <BidsModal
        bidsModal={bidsModal}
        setBidsModal={setBidsModal}
        data={data}
        close={close}
      />

      <BoostShiftModal
        boostModal={boostModal}
        setBoostModal={setBoostModal}
        setData={setData}
        data={data}
      />
      {shift.data && (
        <EditModal
          editModal={editModal}
          setEditModal={setEditModal}
          setData={setData}
          data={shift.data}
        />
      )}
      <ProfileViewModal
        profileModal={profileModal}
        setProfileModal={setProfileModal}
      />
    </div>
  );
};

const BidsModal = ({ bidsModal, setBidsModal, close: closeShiftModal }) => {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const data = bidsModal.data;
  console.log("data bidsModal", data);

  const handleAccept = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formdata = new FormData();
    formdata.append("user_id", data.user_id);
    formdata.append("type", "Accept");

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formdata,
      redirect: "follow",
    };

    fetch(`${acceptBid}/${data.shift_id}/${user.id}`, requestOptions)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          toast.success("Bid Accepted!");
          setBidsModal(false);
          closeShiftModal();
        } else if (json?.error) {
          toast.error(json?.error?.[0]?.message || json?.error?.message);
        }
      })
      .catch((error) => toast.error(error?.[0]?.message || error?.message))
      .finally(() => setLoading(false));
  };

  const close = () => setBidsModal((prev) => ({ ...prev, isOpen: false }));

  const styles = {
    modal: {
      base: "fixed inset-0 !mt-0 flex justify-center items-center bg-black bg-opacity-50 z-50 transition-opacity px-5",
      open: bidsModal.isOpen
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
    createButton: `!w-full !rounded-md ${loading ? "!py-2" : "!py-2.5"}`,
    ignoreButton: `!w-full !rounded-md !border !border-primary-500 !text-primary-500 !bg-transparent ${
      loading ? "!py-2" : "!py-2.5"
    }`,
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  const averageRating =
    eval(
      data?.reviews?.reduce((a, e) => (a += Number(e.stars)), 0) /
        data?.reviews?.length
    ) || 0;

  return (
    <div
      className={`${styles.modal.base} ${styles.modal.open}`}
      onClick={handleBackdropClick}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className="text-lg font-semibold">Shift Bid</h2>
          <button onClick={close} className={styles.closeButton}>
            <VscClose />
          </button>
        </div>
        <div
          className={`${styles.main.base} ${styles.main.grid} ${styles.main.gap}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-2">
              <img
                src={data?.profile_image}
                className="rounded-md size-10"
                alt={data?.user_name}
              />

              <div className="flex flex-col text-xs">
                <span className="text-base font-semibold capitalize">
                  {data?.user_name}
                </span>

                <div className="flex items-center space-x-0.5">
                  {new Array(5)
                    .fill(0)
                    .map((_, index) =>
                      index + 1 > averageRating ? (
                        <FaRegStar key={index} className="text-primary-500" />
                      ) : (
                        <FaStar key={index} className="text-primary-500" />
                      )
                    )}
                  <span className="text-xs">({averageRating.toFixed(1)})</span>
                </div>
              </div>
            </div>
            <Link
              to={"/messages/" + data?.user_id}
              className="text-xl text-primary-500 hover:text-primary-600"
            >
              <MdChat />
            </Link>
          </div>
          <div className="flex items-center justify-end">
            <span className="text-sm font-semibold">
              {formatNumbers(data?.price || 0, "currency")}/hr
            </span>
          </div>

          <p className="text-sm font-medium">Personal Description</p>
          <p className="text-xs">{data?.description}</p>
        </div>
        <div className={styles.footer}>
          <Button
            title="Ignore"
            handleClick={close}
            extraStyles={styles.ignoreButton}
          />
          <Button
            title="Accept"
            handleClick={handleAccept}
            extraStyles={styles.createButton}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export const BoostShiftModal = ({
  boostModal,
  setBoostModal,
  data,
  setData,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleBoost = (e) => {
    e.preventDefault();
    setLoading(true);

    const formdata = new FormData();
    formdata.append("start_date", startDate);
    formdata.append("end_date", endDate);
    formdata.append("boost_fee", budget);

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formdata,
      redirect: "follow",
    };

    fetch(shiftBoost + data.id, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        console.log("res", res);
        if (res.success) {
          setData((prev) => ({
            ...prev,
            data: prev.data.map((e) =>
              e.id === data.id ? { ...e, boost_status: "Yes" } : e
            ),
          }));
          toast.success("Shift boosted successfully!");
          setBoostModal(false);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const close = () => setBoostModal(false);

  const styles = {
    modal: {
      base: "fixed inset-0 !mt-0 flex justify-center items-center bg-black bg-opacity-50 z-50 transition-opacity px-5",
      open: boostModal
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

  return (
    <div
      className={`${styles.modal.base} ${styles.modal.open}`}
      onClick={handleBackdropClick}
    >
      <form onSubmit={handleBoost} className={styles.content}>
        <div className={styles.header}>
          <h2 className="text-lg font-semibold">Boost Your Job</h2>
          <button onClick={close} className={styles.closeButton}>
            <VscClose />
          </button>
        </div>
        <div
          className={`${styles.main.base} ${styles.main.grid} ${styles.main.gap} text-center`}
        >
          <div className="flex items-center space-x-2">
            <div className="w-1/2">
              <label
                htmlFor="boost_start_date"
                className="block mb-2 text-xs font-medium text-left text-gray-900 capitalize"
              >
                boost start date
              </label>
              <input
                type="date"
                id="boost_start_date"
                name="boost_start_date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                required
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="boost_end_date"
                className="block mb-2 text-xs font-medium text-left text-gray-900 capitalize"
              >
                boost end date
              </label>
              <input
                type="date"
                id="boost_end_date"
                name="boost_end_date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                required
              />
            </div>
          </div>

          <br />
          <h4 className="text-lg font-semibold text-left text-gray-500">
            Total budget
          </h4>
          <p className="text-xs text-center text-gray-500">
            This amount is for one day of your starting date
          </p>

          {/* Range input */}
          <div className="flex flex-col items-center mt-4 mb-6 space-y-2">
            <span className="font-semibold text-gray-600">
              ${Number(budget).toFixed(2)}{" "}
              <MdEdit className="inline text-lg text-primary-600" />
            </span>
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              required
            />
          </div>
        </div>
        <div className={styles.footer}>
          <Button
            type="submit"
            title="Boost Your Job"
            extraStyles={styles.createButton}
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
};

const EditModal = ({ editModal, setEditModal, data, setData }) => {
  const [state, setState] = useState(data);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!editModal) return;

    setLoading(true);

    const formdata = new FormData();
    [
      "title",
      "description",
      "opening_date",
      "start_time",
      "end_time",
      "service_type",
      "staff_type",
      // "staff",
    ].forEach((key) => {
      if (key === "opening_date") {
        formdata.append(key, moment(state[key]).format("YYYY-MM-DD"));
        console.log(key, moment(state[key]).format("YYYY-MM-DD"));
      } else if (key === "staff_type") {
        formdata.append(key, state.staff);
        console.log(key, state.staff);
      } else {
        formdata.append(key, state[key]);
        console.log(key, state[key]);
      }
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formdata,
      redirect: "follow",
    };

    fetch(editShift + data.id, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        console.log("res", res);
        if (res.success) {
          const updatedData = res.success.data;
          setData((prev) => ({
            ...prev,
            data: prev.data.map((d) =>
              d.id === updatedData.id ? { ...d, ...updatedData } : d
            ),
          }));

          toast.success("Shift updated successfully!");
          setEditModal(false);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const close = () => setEditModal(false);

  const styles = {
    modal: {
      base: "fixed inset-0 !mt-0 flex justify-center items-center bg-black bg-opacity-50 z-50 transition-opacity px-5",
      open: editModal
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

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setState({ ...state, [name]: value });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  useEffect(() => {
    const fetchServiceTypes = () => {
      fetch(getServiceTypes)
        .then((res) => res.json())
        .then((res) => {
          console.log("res", res);
          if (res.success) {
            setServiceTypes(res.success.data);
          }
        })
        .catch((err) => console.log(err));
    };

    fetchServiceTypes();
  }, []);

  return (
    <div
      className={`${styles.modal.base} ${styles.modal.open}`}
      onClick={handleBackdropClick}
    >
      <form onSubmit={handleSubmit} className={styles.content}>
        <div className={styles.header}>
          <h2 className="text-lg font-semibold">Edit {data?.title}</h2>
          <button onClick={close} className={styles.closeButton}>
            <VscClose />
          </button>
        </div>
        <div
          className={`${styles.main.base} ${styles.main.grid} ${styles.main.gap}`}
        >
          <div className="flex flex-col space-y-4">
            <div className="w-full">
              <label
                htmlFor="title"
                className="block mb-2 text-xs font-medium text-left text-gray-900 capitalize"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={state?.title}
                onChange={handleChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="description"
                className="block mb-2 text-xs font-medium text-left text-gray-900 capitalize"
              >
                description
              </label>
              <textarea
                id="description"
                name="description"
                rows={8}
                placeholder="Enter shift description"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500/50 focus:border-blue-600 block w-full p-2.5"
                value={state?.description}
                onChange={handleChange}
                required
              />
            </div>
            <DropdownField
              arr={serviceTypes}
              title="Service Type"
              state={state?.service_type}
              setState={(value) =>
                handleChange({ target: { value, name: "service_type" } })
              }
              getOption={(val) => val.service_name}
              required
              label
            />
            <DropdownField
              arr={serviceTypes}
              title="Staff Type"
              state={state?.staff}
              setState={(value) =>
                handleChange({ target: { value, name: "staff" } })
              }
              getOption={(val) => val.service_name}
              getValue={(val) => val.id}
              required
              label
            />
            <div className="w-full">
              <label
                htmlFor="opening_date"
                className="block mb-2 text-xs font-medium text-left text-gray-900 capitalize"
              >
                Select Date
              </label>
              <input
                type="date"
                id="opening_date"
                name="opening_date"
                value={state?.opening_date}
                onChange={handleChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                required
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-1/2">
                <label
                  htmlFor="start_time"
                  className="block mb-2 text-xs font-medium text-left text-gray-900 capitalize"
                >
                  Shift Timing in
                </label>
                <input
                  type="time"
                  id="start_time"
                  name="start_time"
                  value={state?.start_time}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                  required
                />
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="end_time"
                  className="block mb-2 text-xs font-medium text-left text-gray-900 capitalize"
                >
                  Shift Timing out
                </label>
                <input
                  type="time"
                  id="end_time"
                  name="end_time"
                  value={state?.end_time}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <Button
            type="submit"
            title="Update"
            extraStyles={styles.createButton}
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default FacilityShiftModal;
