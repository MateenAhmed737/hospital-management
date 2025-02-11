import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Loader, Page } from "../../components";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { base_url } from "../../utils/url";

const ChangePassword = () => {
  const navigate = useNavigate();
  const app = useSelector((state) => state.app);
  const user = useSelector((state) => state.user);
  const [toggleBtn, setToggleBtn] = useState(false);
  const [currentPassword, setCurrentPassword] = useState({
    isVisible: false,
    value: "",
  });
  const [newPassword, setNewPassword] = useState({
    isVisible: false,
    value: "",
  });
  const [password, setPassword] = useState({
    isVisible: false,
    value: "",
  });
  const [confirmPassword, setConfirmPassword] = useState({
    isVisible: false,
    value: "",
  });

  const isLoggedOut = user === null;

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "password") {
      setPassword((prev) => ({
        ...prev,
        value,
      }));
    } else if (name === "confirmPassword") {
      setConfirmPassword((prev) => ({
        ...prev,
        value,
      }));
    } else if (name === "currentPassword") {
      setCurrentPassword((prev) => ({
        ...prev,
        value,
      }));
    } else if (name === "newPassword") {
      setNewPassword((prev) => ({
        ...prev,
        value,
      }));
    }
  };

  // console.log("user", user);
  // console.log("app", app);

  const togglePassword = () =>
    setPassword((prev) => ({ ...prev, isVisible: !prev.isVisible }));
  const toggleNewPassword = () =>
    setNewPassword((prev) => ({ ...prev, isVisible: !prev.isVisible }));
  const toggleCurrentPassword = () =>
    setCurrentPassword((prev) => ({ ...prev, isVisible: !prev.isVisible }));
  const toggleConfirmPassword = () =>
    setConfirmPassword((prev) => ({ ...prev, isVisible: !prev.isVisible }));

  const handleSubmit = async (e) => {
    const id = isLoggedOut ? app.otpData.data.id : user.id;
    const role_id = isLoggedOut ? app.otpData.data.role_id : user.role_id;

    const url = `${base_url}/${
      isLoggedOut ? "user-reset-password" : "change-password"
    }/${id}`;
    e.preventDefault();
    setToggleBtn(true);

    try {
      let formdata = new FormData();
      formdata.append("role_id", role_id);
      if (isLoggedOut) {
        formdata.append("password", password.value);
        formdata.append("password_confirmation", confirmPassword.value);
      } else {
        formdata.append("new_password", newPassword.value);
        formdata.append("current_password", currentPassword.value);
      }

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
      // console.log("data =============>", json);

      if (json.success) {
        toast.success("Password changed successfully!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error(json?.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setToggleBtn(false);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue =
        "Are you sure you want to leave? You'll need to verify your email again";
    };

    !user && document.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      !user && document.addEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user]);

  if (!app.otpData && !user) {
    return <Navigate to="/forgot-password" />;
  }

  return (
    <Page title="Change Password" extraClasses="pt-10 h-screen">
      <main className="flex justify-center w-full h-full p-3 font-poppins">
        <div className="w-full max-w-md p-4">
          <h2 className="mb-2 text-lg font-semibold">Change Password</h2>

          <p className="text-[11px] mb-3">
            Please fill these fields to finish.
          </p>

          <form onSubmit={handleSubmit}>
            {isLoggedOut ? (
              <>
                <div>
                  <label
                    htmlFor="password"
                    className="block w-full mb-1 text-xs font-medium text-gray-900"
                  >
                    Password
                  </label>
                  <div className="flex items-center shadow-sm bg-gray-50 border border-gray-300 text-gray-900 mb-2.5 text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full">
                    <input
                      type={password.isVisible ? "text" : "password"}
                      name="password"
                      id="password"
                      onChange={handleChange}
                      value={password.value}
                      className="w-full p-2.5 bg-transparent outline-none"
                      placeholder="Password"
                      required={true}
                    />
                    <div className="w-8 text-lg text-primary-500">
                      {password.isVisible ? (
                        <AiFillEye
                          onClick={togglePassword}
                          className="cursor-pointer text-primary-500"
                        />
                      ) : (
                        <AiFillEyeInvisible
                          onClick={togglePassword}
                          className="cursor-pointer text-primary-500"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block w-full mb-1 text-xs font-medium text-gray-900"
                  >
                    Confirm Password
                  </label>
                  <div className="flex items-center shadow-sm bg-gray-50 border border-gray-300 text-gray-900 mb-2.5 text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full">
                    <input
                      type={confirmPassword.isVisible ? "text" : "password"}
                      name="confirmPassword"
                      id="confirmPassword"
                      onChange={handleChange}
                      value={confirmPassword.value}
                      className="w-full p-2.5 bg-transparent outline-none"
                      placeholder="Password"
                      required={true}
                    />
                    <div className="w-8 text-lg text-primary-500">
                      {confirmPassword.isVisible ? (
                        <AiFillEye
                          onClick={toggleConfirmPassword}
                          className="cursor-pointer text-primary-500"
                        />
                      ) : (
                        <AiFillEyeInvisible
                          onClick={toggleConfirmPassword}
                          className="cursor-pointer text-primary-500"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block w-full mb-1 text-xs font-medium text-gray-900"
                  >
                    Current Password
                  </label>
                  <div className="flex items-center shadow-sm bg-gray-50 border border-gray-300 text-gray-900 mb-2.5 text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full">
                    <input
                      type={currentPassword.isVisible ? "text" : "password"}
                      name="currentPassword"
                      id="currentPassword"
                      onChange={handleChange}
                      value={currentPassword.value}
                      className="w-full p-2.5 bg-transparent outline-none"
                      placeholder="Password"
                      required={true}
                    />
                    <div className="w-8 text-lg text-primary-500">
                      {currentPassword.isVisible ? (
                        <AiFillEye
                          onClick={toggleCurrentPassword}
                          className="cursor-pointer text-primary-500"
                        />
                      ) : (
                        <AiFillEyeInvisible
                          onClick={toggleCurrentPassword}
                          className="cursor-pointer text-primary-500"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block w-full mb-1 text-xs font-medium text-gray-900"
                  >
                    New Password
                  </label>
                  <div className="flex items-center shadow-sm bg-gray-50 border border-gray-300 text-gray-900 mb-2.5 text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full">
                    <input
                      type={newPassword.isVisible ? "text" : "password"}
                      name="newPassword"
                      id="newPassword"
                      onChange={handleChange}
                      value={newPassword.value}
                      className="w-full p-2.5 bg-transparent outline-none"
                      placeholder="Password"
                      required={true}
                    />
                    <div className="w-8 text-lg text-primary-500">
                      {newPassword.isVisible ? (
                        <AiFillEye
                          onClick={toggleNewPassword}
                          className="cursor-pointer text-primary-500"
                        />
                      ) : (
                        <AiFillEyeInvisible
                          onClick={toggleNewPassword}
                          className="cursor-pointer text-primary-500"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="flex justify-center items-center w-full text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-200 font-medium rounded-lg text-xs px-5 py-2.5 mt-2 text-center disabled:bg-primary-300 disabled:saturate-30 disabled:py-1 disabled:cursor-not-allowed"
              disabled={toggleBtn}
            >
              {toggleBtn ? (
                <>
                  <Loader
                    extraStyles="!static !inset-auto !block !scale-50 !bg-transparent !saturate-100"
                    loaderColor={toggleBtn ? "fill-primary-300" : ""}
                  />
                  Changing
                </>
              ) : (
                "Change"
              )}
            </button>
          </form>
        </div>
      </main>
    </Page>
  );
};

export default ChangePassword;
