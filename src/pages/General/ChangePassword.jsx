import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Loader, Page } from "../../components";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useSelector } from "react-redux";

const ChangePassword = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const [toggleBtn, setToggleBtn] = useState(false);
  const [newPassword, setNewPassword] = useState({
    isVisible: false,
    value: "",
  });
  const [confirmPassword, setConfirmPassword] = useState({
    isVisible: false,
    value: "",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "newPassword") {
      setNewPassword((prev) => ({
        ...prev,
        value,
      }));
    } else if (name === "confirmPassword") {
      setConfirmPassword((prev) => ({
        ...prev,
        value,
      }));
    }
  };

  const toggleNewPassword = () =>
    setNewPassword((prev) => ({ ...prev, isVisible: !prev.isVisible }));
  const toggleConfirmPassword = () =>
    setConfirmPassword((prev) => ({ ...prev, isVisible: !prev.isVisible }));

  const handleSubmit = async (e) => {
    // const url = `${base_url}/company-reset-password/${
    //   user ? user?.id : otpData?.data?.id
    // }`;
    // e.preventDefault();
    // setToggleBtn(true);
    // console.log("otpData", otpData);

    // try {
    //   let formdata = new FormData();
    //   const role =
    //     (user?.role || otpData?.data?.role) === "1"
    //       ? "Company"
    //       : "Project Manager";

    //   formdata.append("type", role);
    //   formdata.append("password", newPassword.value);
    //   formdata.append("password_confirmation", confirmPassword.value);

    //   let requestOptions = {
    //     headers: {
    //       Accept: "application/json",
    //     },
    //     method: "POST",
    //     body: formdata,
    //     redirect: "follow",
    //   };

    //   const res = await fetch(url, requestOptions);
    //   const json = await res.json();
    //   console.log("data =============>", json);

    //   if (json.success) {
    //     toast.success("Password changed successfully!");
    //     setTimeout(() => {
    //       navigate("/login");
    //     }, 2000);
    //   } else {
    //     toast.error(json?.message);
    //   }
    // } catch (err) {
    //   console.error(err);
    // } finally {
    //   setToggleBtn(false);
    // }
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
  }, []);

  if (!user) {
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
