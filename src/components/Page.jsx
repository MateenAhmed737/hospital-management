import { useEffect, useState } from "react";
import Account from "./Account";
import { useSelector } from "react-redux";
import Notifications from "./Notifications";
import { base_url } from "../utils/url";

const getNotificationsUrl = `${base_url}/all-notification/`;
const initialState = { account: false, notifications: false };

const Page = ({
  title,
  containerStyles = "",
  headerStyles = "",
  children,
  enableHeader,
}) => {
  const user = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState(null);
  const [toggle, setToggle] = useState(initialState);

  const setSingleToggle = (key, value) =>
    setToggle({ ...initialState, [key]: value });

  useEffect(() => {
    document.title = title + " - NSCS";

    return () => {
      document.title = "NSCS";
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
      }, 20000);

      return () => {
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
