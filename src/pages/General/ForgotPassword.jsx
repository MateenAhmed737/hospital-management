import React from "react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader, Page } from "../../components";
import { base_url } from "../../utils/url";
import { appActions } from "../../store/slices/appSlice";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [toggleBtn, setToggleBtn] = useState(false);
  const [params] = useSearchParams();
  const isCompany = params.get("isCompany") === "true";

  const handleChange = (e) => {
    const value = e.target.value;

    setEmail(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToggleBtn(true);
    let json = null;

    try {
      let formdata = new FormData();
      formdata.append("email", email);
      formdata.append("role_id", role);

      let requestOptions = {
        headers: {
          Accept: "application/json",
        },
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      const res = await fetch(
        `${base_url}/user-forgot-password`,
        requestOptions
      );
      json = await res.json();

      if (json.success) {
        const data = json.success;

        // console.log("data", data);
        dispatch(appActions.set({ otpData: data }));

        navigate("/email-verification");
      } else {
        toast.error(
          json?.error?.message.toLowerCase().includes("not found")
            ? "Email not found!"
            : json?.error?.message,
          { duration: 1500 }
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setToggleBtn(false);
    }
  };

  return (
    <Page title="Reset Password" extraClasses="pt-10 h-screen">
      <main className="flex justify-center w-full h-full p-3 font-poppins">
        <div className="w-full max-w-md p-4">
          <h2 className="mb-2 text-lg font-semibold">Reset Password</h2>

          <p className="mb-3 text-xs">
            Please enter your {isCompany ? "company" : "PM account"} email
            address, and we will send you an OTP to confirm it.
          </p>

          <form onSubmit={handleSubmit} method="POST">
            <label
              htmlFor="email"
              className="block w-full mb-1 text-xs font-medium text-gray-900"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleChange}
              value={email}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 mb-2.5 text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 outline-none transition-all duration-300"
              placeholder="example@gmail.com"
              required={true}
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 mb-2.5 text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 outline-none transition-all duration-300"
            >
              <option value="">Select role</option>
              <option value="1">Staff</option>
              <option value="3">Facility</option>
            </select>

            <button
              type="submit"
              className="flex justify-center items-center w-full text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-xs px-5 py-2.5 text-center disabled:bg-primary-300 disabled:saturate-30 disabled:py-1 disabled:cursor-not-allowed"
              disabled={toggleBtn}
            >
              {toggleBtn && (
                <Loader
                  extraStyles="!static !inset-auto !block !scale-50 !bg-transparent !saturate-100"
                  loaderColor={toggleBtn ? "fill-primary-300" : ""}
                />
              )}
              Next
            </button>
          </form>
        </div>
      </main>
    </Page>
  );
};

export default ForgotPassword;
