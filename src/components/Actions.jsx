import { useState } from "react";
import { AiFillEye, AiFillFolderOpen } from "react-icons/ai";
import { FaMoneyCheck, FaTasks } from "react-icons/fa";
import { FaFileVideo, FaFileImage } from "react-icons/fa6";
import { CgUnblock } from "react-icons/cg";
import { TbDiscountCheckFilled } from "react-icons/tb";
import {
  MdBlock,
  MdDelete,
  MdModeEdit,
  MdNotificationAdd,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { base_url } from "../utils/url";
import { modifyData } from "../utils";

const Actions = ({
  id,
  data,
  setData,
  actionCols,
  neededProps,
  setPaginatedData,
  setEditModal,
  setMediaModal,
  setViewModal,
  setImagesViewer,
  setVideosViewer,
  setMarkPaidModal,
  setPaymentModal,
  setMarkReceivedModal,
  setNotificationModal,
  blockUrl,
  deleteUrl,
}) => {
  const navigate = useNavigate();
  const [blockUser, setBlockUser] = useState(
    data?.status?.toLowerCase() === "inactive"
  );

  const remove = async () => {
    try {
      const isFunction = typeof deleteUrl === "function";
      const requestOptions = {
        headers: {
          accept: "application/json",
        },
        method: "POST",
        redirect: "follow",
      };
      const res = await fetch(
        ...(isFunction
          ? deleteUrl(data)
          : [`${deleteUrl}/${id}`, requestOptions])
      );

      if (res.status === 200) {
        setData((prev) => prev.filter((e) => e.id !== id));
        setPaginatedData((prev) => ({
          ...prev,
          items: prev.items.filter((e) => e.id !== id),
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlock = async () => {
    try {
      const isFunction = typeof blockUrl === "function";
      const requestOptions = {
        headers: {
          accept: "application/json",
        },
        method: "POST",
        redirect: "follow",
      };
      const res = await fetch(
        ...(isFunction ? blockUrl(data) : [`${blockUrl}/${id}`, requestOptions])
      );
      console.log("res status =======>", res.status);

      if (res.status === 200) {
        setBlockUser(!blockUser);
        setData((prev) =>
          prev.map((item) =>
            item.id == id
              ? {
                  ...item,
                  status:
                    item.status.toLowerCase() === "active"
                      ? "INACTIVE"
                      : "ACTIVE",
                }
              : item
          )
        );
        setPaginatedData((prev) => ({
          ...prev,
          items: prev.items.map((item) =>
            item.id == id
              ? {
                  ...item,
                  status:
                    item.status.toLowerCase() === "active"
                      ? "INACTIVE"
                      : "ACTIVE",
                }
              : item
          ),
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const editJob = async (key, value) => {
    try {
      const formdata = new FormData();
      formdata.append(key, value);
      const requestOptions = {
        header: {
          accept: "application/json",
        },
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      const res = await fetch(
        `${base_url}/edit-company-lead/${id}`,
        requestOptions
      );
      const json = await res.json();
      console.log("json", json);

      if (json.success) {
        const newState = modifyData(json.success.data, neededProps, true);
        newState.lead_by = newState.lead_by ? "Sales Team" : "Company";

        setData((prev) => prev.map((e) => (e.id === id ? newState : e)));
        setPaginatedData((prev) => ({
          ...prev,
          items: prev.items.map((e) => (e.id === id ? newState : e)),
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkAction = (name) => {
    let element;

    if (name === "View") {
      element = (
        <td className="self-center px-6 py-2 pt-4 text-lg text-center">
          <button
            onClick={() => setViewModal({ isOpen: true, data })}
            className="font-medium text-gray-600 hover:text-gray-800"
          >
            <AiFillEye />
          </button>
        </td>
      );
    } else if (name === "Images") {
      element = (
        <td className="self-center px-6 py-2 pt-4 text-lg text-center">
          <button
            onClick={() =>
              setImagesViewer({ isOpen: true, images: data._images })
            }
            className="font-medium text-gray-600 hover:text-gray-800"
          >
            <FaFileImage />
          </button>
        </td>
      );
    } else if (name === "Videos") {
      element = (
        <td className="self-center px-6 py-2 pt-4 text-lg text-center">
          <button
            onClick={() =>
              setVideosViewer({ isOpen: true, videos: data._videos })
            }
            className="font-medium text-gray-600 hover:text-gray-800"
          >
            <FaFileVideo />
          </button>
        </td>
      );
    } else if (name === "Tasks") {
      element = (
        <td className="self-center px-6 py-2 pt-4 text-lg text-center">
          <button
            onClick={() =>
              navigate(
                `/job-tasks/${data?.id}/${data?.pm_id ?? data?._pm_id}/${
                  data?.work_budget
                }`
              )
            }
            className="font-medium text-gray-600 hover:text-gray-800"
          >
            <FaTasks />
          </button>
        </td>
      );
    } else if (name === "Sub Accounts") {
      element = (
        <td className="self-center px-6 py-2 pt-4 text-lg text-center">
          <button
            onClick={() => navigate("/sub-accounts/" + data.id)}
            className="font-medium text-gray-600 hover:text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              class="bi bi-box-arrow-in-up-right"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M6.364 13.5a.5.5 0 0 0 .5.5H13.5a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 13.5 1h-10A1.5 1.5 0 0 0 2 2.5v6.636a.5.5 0 1 0 1 0V2.5a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5H6.864a.5.5 0 0 0-.5.5z"
              />
              <path
                fill-rule="evenodd"
                d="M11 5.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793l-8.147 8.146a.5.5 0 0 0 .708.708L10 6.707V10.5a.5.5 0 0 0 1 0v-5z"
              />
            </svg>
          </button>
        </td>
      );
    } else if (name === "Media") {
      element = (
        <td className="self-center px-6 py-2 pt-4 text-lg text-center">
          <button
            onClick={() =>
              setMediaModal({
                isOpen: true,
                media: data._media || data._media_files,
              })
            }
            className="font-medium text-gray-600 hover:text-gray-800"
          >
            <AiFillFolderOpen />
          </button>
        </td>
      );
    } else if (name === "Mark Paid") {
      element = (
        <td className="self-center px-3 py-1 pt-3 text-2xl text-center">
          {data?.payment === "Paid" ? (
            <TbDiscountCheckFilled
              className="mx-auto text-blue-600"
              title={`Transaction ID: ${data?._transaction_id ?? "-"}
              Payment Method: ${data?._payment_method ?? "-"}`}
            />
          ) : (
            <button
              onClick={() => setMarkPaidModal({ data, isOpen: true })}
              className="text-gray-600 hover:text-gray-800"
              title="Mark as Paid"
            >
              <TbDiscountCheckFilled />
            </button>
          )}
        </td>
      );
    } else if (name === "Mark Received") {
      element = (
        <td className="self-center px-3 py-1 pt-3 text-2xl text-center">
          {data?._payment?.toLowerCase() === "received" ||
          data?.payment?.toLowerCase() === "received" ? (
            <TbDiscountCheckFilled
              className="mx-auto text-blue-600"
              title="Payment Received"
            />
          ) : (
            <button
              onClick={() =>
                setMarkReceivedModal((prev) => ({
                  ...prev,
                  data,
                  isOpen: true,
                }))
              }
              className="text-gray-600 hover:text-gray-800"
              title="Mark as Received"
            >
              <TbDiscountCheckFilled />
            </button>
          )}
        </td>
      );
    } else if (name === "Mark Completed") {
      element = (
        <td className="self-center px-3 py-1 pt-3 text-2xl text-center">
          {data?.status?.toLowerCase() === "completed" ? (
            <TbDiscountCheckFilled
              className="mx-auto text-blue-600"
              title="Job Completed"
            />
          ) : (
            <button
              onClick={() => editJob("status", "Completed")}
              className="text-gray-600 hover:text-gray-800"
              title="Mark as Completed"
            >
              <TbDiscountCheckFilled />
            </button>
          )}
        </td>
      );
    } else if (name === "Edit") {
      element = (
        <td className="self-center px-6 py-2 pt-4 text-lg text-center">
          <button
            onClick={() => setEditModal({ isOpen: true, data })}
            className="font-medium text-gray-600 hover:text-gray-800"
          >
            <MdModeEdit />
          </button>
        </td>
      );
    } else if (name === "Delete" || name === "Remove") {
      element = (
        <td className="self-center px-6 py-2 pt-4 text-lg text-center">
          <button
            onClick={remove}
            className="font-medium text-gray-600 hover:text-gray-800"
          >
            <MdDelete />
          </button>
        </td>
      );
    } else if (name === "Pay") {
      element = (
        <td className="self-center px-3 py-1 pt-3 text-xl text-center">
          {data.status === "Paid" ? (
            <TbDiscountCheckFilled
              className="mx-auto text-blue-600"
              title="Invoice Paid"
            />
          ) : (
            <button
              onClick={() => setPaymentModal({ isOpen: true, data })}
              className="text-gray-600 hover:text-gray-800"
              title="Pay Invoice"
            >
              <FaMoneyCheck />
            </button>
          )}
        </td>
      );
    } else if (name === "Push Notification") {
      element = (
        <td className="self-center px-3 py-1 pt-3 text-xl text-center">
          <button
            className="font-medium text-gray-600 hover:text-gray-800"
            onClick={() => setNotificationModal({ isOpen: true, data })}
          >
            <MdNotificationAdd />
          </button>
        </td>
      );
    } else if (name === "Block/Unblock") {
      element = (
        <td className="self-center px-6 py-2 pt-4 text-lg text-center">
          <button
            onClick={handleBlock}
            className="font-medium text-red-600"
            title={blockUser ? "Unblock user" : "Block user"}
          >
            {blockUser ? <CgUnblock /> : <MdBlock />}
          </button>
        </td>
      );
    } else {
      element = <div>Action column not found!</div>;
    }

    return element;
  };

  return actionCols.map((item) => checkAction(item));
};

export default Actions;
