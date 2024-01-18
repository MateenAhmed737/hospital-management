import { MdOutlineDoneAll } from "react-icons/md";
import { base_url } from "../utils/url";
import { notificationIcons } from "../constants/data";
import { VscClose } from "react-icons/vsc";
import { DropdownContainer } from "./Account";

const Notifications = ({
  toggle,
  setSingleToggle,
  notifications,
  setNotifications,
  userId,
  role,
}) => {
  const handleReadAll = async () => {
    const url = `${base_url}/read-admin-notification/${userId}`;
    console.log(`${base_url}/read-admin-notification/${userId}`);

    try {
      const formdata = new FormData();
      formdata.append("type", role);
      const requestOptions = {
        headers: {
          Accept: "application/json",
        },
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      const res = await fetch(url, requestOptions);
      const json = await res.json();
      console.log("json", json);

      if (res.status === 200) {
        setNotifications([]);
        setSingleToggle("notifications", !toggle.notifications);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative" id="notifications">
      <button
        className="flex items-center space-x-3"
        onClick={() => setSingleToggle("notifications", !toggle.notifications)}
      >
        <svg
          className="w-4 h-4"
          width="19"
          height="22"
          viewBox="0 0 19 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.52022 19.5297C7.18539 19.5321 4.86549 19.1573 2.65022 18.4197C1.81022 18.1302 1.16972 17.5399 0.889973 16.7697C0.599723 16.0002 0.700224 15.1497 1.15997 14.3899L2.30972 12.4797C2.54972 12.0799 2.77022 11.2797 2.77022 10.8102V7.91969C2.77022 4.19969 5.80022 1.16969 9.52022 1.16969C13.2402 1.16969 16.2702 4.19969 16.2702 7.91969V10.8102C16.2702 11.2699 16.49 12.0799 16.73 12.4902L17.87 14.3899C18.2997 15.1099 18.38 15.9799 18.0897 16.7697C17.7995 17.5594 17.1702 18.1602 16.3797 18.4197C14.1682 19.158 11.8517 19.5329 9.52022 19.5297ZM9.52022 2.66969C6.62972 2.66969 4.27022 5.02019 4.27022 7.91969V10.8102C4.27022 11.5399 3.97022 12.6199 3.59972 13.2499L2.44997 15.1602C2.22947 15.5299 2.16947 15.9199 2.29997 16.2499C2.41997 16.5897 2.71997 16.8499 3.12947 16.9902C7.27803 18.3903 11.7714 18.3903 15.92 16.9902C16.28 16.8702 16.5597 16.6002 16.6902 16.2402C16.8207 15.8802 16.79 15.4902 16.5897 15.1602L15.44 13.2499C15.0597 12.5997 14.7695 11.5302 14.7695 10.7997V7.91969C14.7695 6.5273 14.2164 5.19194 13.2318 4.20738C12.2472 3.22281 10.9119 2.66969 9.51947 2.66969H9.52022ZM11.3802 2.93969C11.3097 2.93969 11.2392 2.92994 11.1702 2.90969C10.8941 2.83267 10.6136 2.77256 10.3302 2.72969C9.51313 2.6169 8.68142 2.67824 7.88972 2.90969C7.60922 2.99969 7.30922 2.90969 7.11947 2.69969C6.92972 2.48969 6.86972 2.18969 6.97922 1.91969C7.38947 0.869687 8.38922 0.179688 9.52922 0.179688C10.6692 0.179688 11.6697 0.859937 12.0792 1.91969C12.1797 2.18969 12.1295 2.48969 11.9397 2.69969C11.7897 2.86019 11.5805 2.93969 11.3802 2.93969ZM9.51947 21.8097C8.52947 21.8097 7.56947 21.4099 6.86972 20.7102C6.1673 20.0067 5.77176 19.0538 5.76947 18.0597H7.26947C7.26947 18.6499 7.50947 19.2297 7.92947 19.6497C8.34947 20.0697 8.92922 20.3097 9.51947 20.3097C10.7592 20.3097 11.7695 19.3002 11.7695 18.0597H13.2695C13.2695 20.1297 11.5895 21.8097 9.51947 21.8097Z"
            fill="#212121"
          />
        </svg>

        {notifications?.length ? (
          <>
            <div
              className={`absolute -top-[4px] -right-[4px] w-3.5 h-3.5 tracking-tighter text-[9.5px] ${
                notifications?.length > 9 ? "pl-0.5" : ""
              } flex items-center justify-center text-white rounded-full bg-red-500`}
            >
              {notifications?.length > 9 ? "9+" : notifications?.length}
            </div>
          </>
        ) : (
          ""
        )}
      </button>
      {toggle.notifications && (
        <DropdownContainer extraStyles="pr-0.5 hidden min-[930px]:block !top-[120%]">
          <div
            className={`${
              !notifications?.length ? "flex justify-center items-center" : ""
            } overflow-y-scroll overflow-x-auto w-full min-[930px]:min-w-[300px] min-h-[150px] max-h-[200px] pr-3.5`}
          >
            {notifications?.length
              ? notifications
                  .sort((a, b) => b.id - a.id)
                  .map((elem, indx) => {
                    const icon = notificationIcons.default;

                    const handleClick = async (id) => {
                      const url = `${base_url}/read-single-notification/${id}`;

                      try {
                        const requestOptions = {
                          headers: {
                            Accept: "application/json",
                          },
                          method: "POST",
                          redirect: "follow",
                        };
                        const res = await fetch(url, requestOptions);
                        const json = await res.json();
                        console.log("json", json);

                        if (json.success) {
                          setNotifications((prev) =>
                            prev.filter((e) => e?.id !== elem?.id)
                          );
                        }
                      } catch (err) {
                        console.error(err);
                      }
                    };

                    return (
                      <li
                        key={elem.id}
                        onClick={() => handleClick(elem.id)}
                        className={`${
                          notifications?.length - 1 !== indx
                            ? "border-b border-[#efefef]"
                            : ""
                        } flex py-2 ${
                          elem?.markAsRead ? "font-semibold" : ""
                        } cursor-pointer text-gray-600 hover:text-black`}
                      >
                        {icon}
                        <span className="ml-2 whitespace-nowrap">{`${
                          elem.title
                        } - ${elem.message} - ${new Date(
                          elem.created_at
                        ).toLocaleDateString()}`}</span>
                      </li>
                    );
                  })
              : "No notifications found!"}
          </div>
          {notifications?.length ? (
            <div className="pr-3.5">
              <button
                onClick={handleReadAll}
                type="button"
                className="w-full flex justify-center items-center hover:text-blue-600 border-t focus:outline-none font-medium text-base py-1 pt-1.5 mr-5 text-center"
              >
                <MdOutlineDoneAll />
                <span className="ml-1 text-xs">Read All</span>
              </button>
            </div>
          ) : (
            ""
          )}
        </DropdownContainer>
      )}
      <DropdownContainer
        onClick={() => setSingleToggle("notifications", !toggle.notifications)}
        extraStyles={`!p-0 min-[930px]:hidden !fixed !inset-0 ${
          toggle.notifications
            ? "!bg-black/50 !backdrop-blur-[5px]"
            : "!bg-transparent !backdrop-blur-0 !pointer-events-none"
        } transition-all duration-500 !border-0 border-l !rounded-none`}
      >
        <div
          className={`fixed top-0 ${
            toggle.notifications ? "!right-0" : "!-right-full"
          } w-full min-[550px]:max-w-max h-screen bg-white transition-all duration-500 pointer-events-none`}
        >
          <div className="h-full min-w-[350px] px-4 py-2 pt-4 overflow-x-hidden overflow-y-scroll pointer-events-auto min-w-xs">
            <div className="flex items-center justify-between w-full mb-3">
              <h2 className="text-lg font-medium">Notificaitons</h2>
              <button
                onClick={() =>
                  setSingleToggle("notifications", !toggle.notifications)
                }
                className="text-lg hover:text-gray-600"
              >
                <VscClose />
              </button>
            </div>
            <div
              className={`${
                !notifications?.length ? "flex justify-center items-center" : ""
              } w-full min-h-[150px]`}
            >
              {notifications?.length
                ? notifications
                    .sort((a, b) => b.id - a.id)
                    .map((elem, indx) => {
                      const icon = notificationIcons.default;

                      const handleClick = async (id) => {
                        const url = `${base_url}/read-single-notification/${id}`;

                        try {
                          const requestOptions = {
                            headers: {
                              Accept: "application/json",
                            },
                            method: "POST",
                            redirect: "follow",
                          };
                          const res = await fetch(url, requestOptions);
                          const json = await res.json();
                          console.log("json", json);

                          if (json.success) {
                            setNotifications((prev) =>
                              prev.filter((e) => e?.id !== elem?.id)
                            );
                          }
                        } catch (err) {
                          console.error(err);
                        }
                      };

                      return (
                        <li
                          key={elem.id}
                          onClick={() => handleClick(elem.id)}
                          className={`${
                            notifications?.length - 1 !== indx
                              ? "border-b border-[#efefef]"
                              : ""
                          } flex py-2 ${
                            elem?.markAsRead ? "font-semibold" : ""
                          } cursor-pointer text-gray-600 hover:text-black`}
                        >
                          {icon}
                          <span className="ml-2 whitespace-nowrap">{`${
                            elem.title
                          } - ${elem.message} - ${new Date(
                            elem.created_at
                          ).toLocaleDateString()}`}</span>
                        </li>
                      );
                    })
                : "No notifications found!"}
            </div>
            {notifications?.length ? (
              <button
                onClick={handleReadAll}
                type="button"
                className="w-full flex justify-center items-center hover:text-blue-600 border-t focus:outline-none font-medium text-base py-1 pt-1.5 mr-5 text-center"
              >
                <MdOutlineDoneAll />
                <span className="ml-1 text-xs">Read All</span>
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </DropdownContainer>
    </div>
  );
};

export default Notifications;
