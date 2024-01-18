import React, { useEffect, useState } from "react";
import Account from "./Account";
import Notifications from "./Notifications";
import { useSelector } from "react-redux";

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

  const type = user?.role === "1" ? "Company" : "Project Manager";

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

  return (
    <div
      className={`font-poppins bg-white w-full h-full p-3 pl-4 ${containerStyles}`}
    >
      {enableHeader && (
        <header className={styles.header}>
          <h1 className={styles.heading}>{title}</h1>

          <div className="flex items-center space-x-3">
            <Notifications
              {...{
                toggle,
                setSingleToggle,
                notifications,
                setNotifications,
                userId: user?.id,
                role: type,
              }}
            />
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
