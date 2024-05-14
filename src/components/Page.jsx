import React, { useEffect, useState } from "react";
import Account from "./Account";
import { useSelector } from "react-redux";
import Notifications from "./Notifications";
import { base_url } from "../utils/url";

const getNotificationsUrl = `${base_url}/all-notification/`;

const Page = ({
  title,
  containerStyles = "",
  headerStyles = "",
  children,
  enableHeader,
}) => {
  const user = useSelector((state) => state.user);
  const initialState = { account: false, notifications: false };
  const [notifications, setNotifications] = useState(null);
  const [toggle, setToggle] = useState(initialState);

  const setSingleToggle = (key, value) =>
    setToggle({ ...initialState, [key]: value });

  useEffect(() => {
    document.title = title + " - Hospital Management";

    return () => {
      document.title = "Hospital Management";
    };
  }, [title]);

  const styles = {
    header:
      "flex justify-between items-center w-full my-2 mb-6 " + headerStyles,
    heading: "text-xl font-semibold truncate",
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(getNotificationsUrl + user?.id, {method: "POST"});
        const json = await res.json();

        if (json.success) {
          const data = json.success.data;
          console.log("data", data);
          setNotifications(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (user?.isStaff) {
      fetchNotifications();
      const interval = setInterval(() => {
        fetchNotifications();
        // console.log("notifications", notifications);
      }, 20000);

      // const mouseDownHandler = (e) => {
      //   const accountMenu = document.getElementById("account-menu");
      //   const notifications = document.getElementById("notifications");

      //   console.log({ accountMenu, notifications });

      //   if (accountMenu && !accountMenu.contains(e.target)) {
      //     setToggle({ ...toggle, account: false });
      //     console.log("first");
      //   } else if (notifications && !notifications.contains(e.target)) {
      //     console.log("second");
      //     setToggle({ ...toggle, notifications: false });
      //   }
      // };

      // document.addEventListener("click", mouseDownHandler);

      return () => {
        // document.removeEventListener("click", mouseDownHandler);
        clearInterval(interval);
      };
    }
  }, [user?.id, user?.isStaff]);

  return (
    <div
      className={`font-poppins bg-white w-full h-full p-3 pl-4 ${containerStyles}`}
    >
      {enableHeader && (
        <header className={styles.header}>
          <h1 className={styles.heading}>{title}</h1>

          <div className="flex items-center space-x-3">
            {user?.isStaff && (
              <Notifications
                {...{
                  toggle,
                  setSingleToggle,
                  notifications,
                  setNotifications,
                  userId: user?.id,
                }}
              />
            )}
            <Account
              toggle={toggle.account}
              setSingleToggle={setSingleToggle}
            />
          </div>
        </header>
      )}
      {children}
    </div>
  );
};

export default Page;
