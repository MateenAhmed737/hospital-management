import { useState } from "react";
import { VscClose } from "react-icons/vsc";
import { Button } from "../Buttons";
import toast from "react-hot-toast";

const NotificationModal = ({
  notificationModal,
  setNotificationModal,
  paginatedData,
  notificationUrl,
  notificationUrlBulk,
  selected,
  setSelected,
}) => {
  const isBulk = notificationModal.isBulk;
  const url = isBulk
    ? notificationUrlBulk
    : notificationUrl + notificationModal.data.id;

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const close = () => setNotificationModal({ isOpen: false, data: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let formdata = new FormData();
      formdata.append("title", title);
      formdata.append("message", message);
      isBulk &&
        formdata.append(
          "device_token",
          JSON.stringify(
            paginatedData.items
              .filter((e) => selected.includes(e.id))
              .map((e) => e._device_token)
          )
        );

      let requestOptions = {
        headers: {
          Accept: "application/json",
        },
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      const res = await fetch(url, requestOptions);
      const json = await res.json();

      if (json.success) {
        close();
        toast.success("Notification sent!");
        // console.log("NotificationModal =============>", json);
        setLoading(false);
      } else {
        setLoading(false);
        toast.error("An error occurred!");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred!");
      setLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={close}
        className={`fixed inset-0 flex justify-center items-center z-20 bg-black/50`}
      />
      <div
        tabIndex="-1"
        className={`fixed z-20 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto inset-0 h-[calc(100%-1rem)] max-h-full pointer-events-none`}
      >
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-md max-h-full bg-gray-100 rounded-lg pointer-events-auto"
        >
          {/* Modal header */}
          <div className="flex items-start justify-between p-4 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">
              {isBulk && "Bulk"} Push Notification
            </h3>
            <Button
              handleClick={close}
              extraStyles="!text-gray-400 !bg-transparent hover:!bg-gray-200 hover:!text-gray-900 rounded-lg !text-base !p-1.5 !ml-auto inline-flex items-center"
            >
              <VscClose />
            </Button>
          </div>
          {/* Modal content */}
          <div className="grid grid-cols-1 gap-4 p-5 overflow-y-scroll">
            <div>
              <label
                htmlFor="message"
                className="block mb-1 text-sm font-medium text-gray-900"
              >
                Title
              </label>
              <input
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                placeholder="Title goes here..."
                required={true}
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block mb-1 text-sm font-medium text-gray-900"
              >
                Message
              </label>
              <textarea
                name="message"
                id="message"
                rows={10}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                placeholder="Write message here..."
                required={true}
              ></textarea>
            </div>
          </div>

          {/* Modal footer */}
          <div className="flex items-center p-4 space-x-2 border-t border-gray-200 rounded-b">
            <Button
              title="Send"
              isLoading={loading}
              type="submit"
              extraStyles={`w-full ${loading ? "!py-2" : "!py-3"}`}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default NotificationModal;
