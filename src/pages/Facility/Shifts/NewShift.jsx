import React, { useCallback, useEffect, useState } from "react";
import { Button, DropdownField, Page } from "../../../components";
import { VscClose } from "react-icons/vsc";
import { FaPlus } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { base_url } from "../../../utils/url";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import moment from "moment/moment";
import { convertTime } from "../../../utils";

const initialState = {
  title: "",
  description: "",
  job_details: [],
  staff_type: "",
  opening_date: "",
  start_time: "",
  end_time: "",
};

const createUrl = `${base_url}/create-shift/`;

const NewShift = () => {
  const user = useSelector((state) => state.user);
  const [state, setState] = useState(initialState);
  const [jobDetailsModal, setJobDetailsModal] = useState({
    isOpen: false,
    indx: null,
    type: "add",
  });
  const [loading, setLoading] = useState(false);
  const [staffTypes, setStaffTypes] = useState([]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      Object.keys(state)
        .filter((key) => key !== "job_details")
        .some((key) => !state[key])
    ) {
      toast.error("Please fill all fields!", { duration: 2000 });
      return;
    } else if (state.job_details.length === 0) {
      toast.error("Please add job details!", { duration: 2000 });
      return;
    }

    setLoading(true);

    const formdata = new FormData();
    Object.keys(state).forEach((key) => {
      if (key === "job_details") {
        formdata.append("job_details", JSON.stringify(state[key]));
        console.log("job_details", JSON.stringify(state[key]));
      } else if (key === "staff_type") {
        formdata.append("staff", state[key]);
        formdata.append("service_type", state[key]);
        formdata.append("state", user?.state);
        formdata.append("country", user?.country);
        formdata.append("boost_status", "Yes");
        formdata.append("boost_fee", "10");
        formdata.append("boost_start", "2024-02-19");
        formdata.append("boost_end", "2024-05-30");
        
        console.log("boost_fee", "10");
        console.log("boost_start", "2024-02-19");
        console.log("boost_end", "2024-05-30");
        console.log("staff", state[key]);
        console.log("service_type", state[key]);
        console.log("state", user?.state);
        console.log("country", user?.country);
        console.log("boost_status", "Yes");
      } else if (key === "opening_date") {
        formdata.append(key, moment(state[key]).format("YYYY-MM-DD"));
        console.log(key, moment(state[key]).format("YYYY-MM-DD"));
      } else if (key === "start_time" || key === "end_time") {
        formdata.append(key, convertTime(state[key]).split(" ")[0] + ":00");
        console.log(key, convertTime(state[key]).split(" ")[0] + ":00");
      } else {
        formdata.append(key, state[key]);
        console.log(key, state[key]);
      }
    });

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
      headers: {
        Accept: "application/json",
      },
    };

    fetch(createUrl + user.id, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        console.log('res ==>', res)
        if (res.success) {
          toast.success("Shift created successfully!", { duration: 2000 });
          setState(initialState);
        } else {
          toast.error("An error occurred while creating shift!", {
            duration: 2000,
          });
        }
      }).catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const fetchStaffTypes = () => {
      const requestOptions = {
        headers: {
          Accept: "application/json",
        },
        method: "GET",
        redirect: "follow",
      };

      fetch(`${base_url}/get-services`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log("data", data);
          if (data.success) {
            setStaffTypes(data.success.data);
          } else {
            toast.error(data.error.message, { duration: 2000 });
          }
        })
        .catch((error) => console.error(error));
    };

    fetchStaffTypes();
  }, []);

  return (
    <Page title="New Shift" enableHeader>
      <div className="grid max-w-lg grid-cols-2 gap-4 mx-auto">
        <div className="col-span-2">
          <label
            htmlFor="title"
            className="block mb-1 text-xs font-medium text-gray-900 capitalize"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={state.title}
            onChange={handleChange}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            required={true}
          />
        </div>
        <div className="col-span-2">
          <label
            htmlFor="description"
            className="block mb-1 text-xs font-medium text-gray-900 capitalize"
          >
            Description
          </label>
          <textarea
            rows={8}
            id="description"
            name="description"
            value={state.description}
            onChange={handleChange}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg outline-none focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            placeholder="Write description here..."
            required={true}
          />
        </div>
        <div className="col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Add Job Detail</span>
            <button
              onClick={() =>
                setJobDetailsModal({ isOpen: true, indx: null, type: "add" })
              }
              className="flex items-center justify-center p-0.5 border border-black rounded-full size-15"
            >
              <FaPlus />
            </button>
          </div>
          <div className="flex flex-col mt-3">
            {state.job_details.map((e, indx) => (
              <div
                key={e.subject + "-" + indx}
                className="flex items-start justify-between"
              >
                <details className="mt-1.5 text-xs mb-3">
                  <summary className="text-sm font-semibold text-gray-900">
                    {e.subject}
                  </summary>
                  <p className="mt-1 ml-4 text-gray-600">{e.detail}</p>
                </details>
                <div className="mt-2">
                  <button
                    onClick={() =>
                      setJobDetailsModal({
                        indx,
                        type: "edit",
                        isOpen: true,
                      })
                    }
                    className="text-xl text-green-800"
                  >
                    <MdEdit />
                  </button>
                  <button
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        job_details: prev.job_details.filter(
                          (e, i) => i !== indx
                        ),
                      }))
                    }
                    className="text-xl text-red-800"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <DropdownField
            title="service_type"
            arr={staffTypes}
            state={state.staff_type}
            setState={(e) => setState({ ...state, staff_type: e })}
            getOption={(val) => val.service_name}
            styles="!rounded-md !bg-gray-100 !py-3 !text-gray-500"
            required
            label
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="opening_date"
            className="block mb-1 text-xs font-medium text-gray-900 capitalize"
          >
            Select Data
          </label>
          <input
            type="date"
            id="opening_date"
            name="opening_date"
            value={state.opening_date}
            onChange={handleChange}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg outline-none focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            required={true}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="start_time"
            className="block mb-1 text-xs font-medium text-gray-900 capitalize"
          >
            Start Time
          </label>
          <input
            type="time"
            id="start_time"
            name="start_time"
            value={state.start_time}
            onChange={handleChange}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg outline-none focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            required={true}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="end_time"
            className="block mb-1 text-xs font-medium text-gray-900 capitalize"
          >
            End Time
          </label>
          <input
            type="time"
            id="end_time"
            name="end_time"
            value={state.end_time}
            onChange={handleChange}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg outline-none focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            required={true}
          />
        </div>
        <div className="col-span-2">
          <Button
            title="Create New Shift"
            extraStyles="!w-full !py-3"
            loading={loading}
            handleClick={handleSubmit}
          />
        </div>
      </div>
      <JobDetailModal
        modal={jobDetailsModal}
        setModal={setJobDetailsModal}
        data={state}
        setData={setState}
      />
    </Page>
  );
};

const JobDetailModal = ({ modal, setModal, data, setData }) => {
  const initialState = useCallback(
    () =>
      typeof modal.indx === "number"
        ? data.job_details[modal.indx]
        : { subject: "", detail: "" },
    [modal.indx, data.job_details]
  );

  const [state, setState] = useState(initialState);
  const isAdd = modal.type === "add";

  const handleSubmit = (e) => {
    e.preventDefault();
    setData((prev) =>
      isAdd
        ? { ...prev, job_details: [...prev.job_details, state] }
        : {
            ...prev,
            job_details: prev.job_details.map((e, i) =>
              i === modal.indx ? state : e
            ),
          }
    );
    close();
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setState((prev) => ({ ...prev, [name]: value }));
  };

  const close = () => {
    setModal({ isOpen: false, indx: null, type: "add" });
    setState({ subject: "", detail: "" });
  };

  const styles = {
    modal: {
      base: "fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50 transition-opacity px-5",
      open: modal.isOpen
        ? "opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none",
    },
    content: "bg-white rounded w-full max-w-sm",
    header: "flex justify-between items-center py-2 px-4 border-b",
    main: {
      base: "p-4 overflow-y-auto max-h-[70vh]",
      grid: `grid grid-cols-1 gap-4`,
    },
    footer: "flex justify-end py-3 px-4 border-t",
    closeButton:
      "text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-base p-1.5 ml-auto inline-flex items-center",
    input:
      "min-h-[37px] w-[300px] shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500/50 focus:border-blue-600 block p-2.5",
    createButton: "!w-full !rounded !py-2.5",
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  useEffect(() => {
    setState(initialState());
  }, [modal.isOpen, initialState]);

  return (
    <div
      className={`${styles.modal.base} ${styles.modal.open}`}
      onClick={handleBackdropClick}
    >
      <form onSubmit={handleSubmit} className={styles.content}>
        <div className={styles.header}>
          <h2 className="text-lg font-semibold">
            {isAdd ? "Add Detail" : "Edit Detail"}
          </h2>
          <button onClick={close} className={styles.closeButton}>
            <VscClose />
          </button>
        </div>
        <div
          className={`${styles.main.base} ${styles.main.grid} ${styles.main.gap}`}
        >
          <div className="col-span-1 sm:col-span-2">
            <label
              htmlFor="subject"
              className="block mb-2 text-xs font-medium text-left text-gray-900 capitalize"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={state.subject}
              onChange={handleChange}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              required={true}
              autoFocus={true}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <label
              htmlFor="detail"
              className="block mb-2 text-xs font-medium text-left text-gray-900 capitalize"
            >
              Detail
            </label>
            <textarea
              rows={8}
              id="detail"
              name="detail"
              value={state.detail}
              onChange={handleChange}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              required={true}
            />
          </div>
        </div>
        <div className={styles.footer}>
          <Button
            type="submit"
            title={isAdd ? "Add" : "Edit"}
            extraStyles={styles.createButton}
          />
        </div>
      </form>
    </div>
  );
};

export default NewShift;
