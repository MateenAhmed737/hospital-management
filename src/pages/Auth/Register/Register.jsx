import React, { useEffect } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { base_url } from "../../../utils/url";
import { Button, DropdownField, Page } from "../../../components";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { countries, states } from "../../../constants/data";
import VerifyOTP from "./VerifyOTP";
import { useAppState } from "../../../hooks";

const roles = {
  1: "Staff",
  2: "Admin",
  3: "Facility",
};

const initialState = {
  role_id: "1",
  profile_image: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: {
    isVisible: false,
    value: "",
  },
  confirm_password: {
    isVisible: false,
    value: "",
  },
  type_of_staff: "",
  Address_line_1: "",
  Address_line_2: "",
  country: "",
  state: "",
  zip_code: "",
};

const Register = () => {
  const { homeRoute } = useAppState();
  const user = useSelector((state) => state.user);

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileError, setProfileError] = useState(false);
  const [staffTypes, setStaffTypes] = useState([]);
  const [state, setState] = useState(initialState);

  const { profile_image, password, confirm_password } = state;
  const props = {
    otp,
    roles,
    data: state,
    setStep,
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "profile_image") {
      setProfileError(false);
      setState({ ...state, [name]: e.target.files[0] });
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const togglePassword = (e) => {
    const name = e.target.id;
    handleChange({
      target: {
        name,
        value: { isVisible: !state[name].isVisible, ...state[name] },
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profile_image) {
      setProfileError(true);
      return;
    } else if (password.value !== confirm_password.value) {
      toast.error("Passwords do not match!", { duration: 2000 });
      return;
    }

    setLoading(true);
    let json = null;

    try {
      const formdata = new FormData();
      formdata.append("email", state.email);

      const requestOptions = {
        headers: {
          Accept: "application/json",
        },
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      const res = await fetch(`${base_url}/auth`, requestOptions);
      json = await res.json();

      console.log(json);

      if (json.success) {
        toast.success("OTP has been sent to your email!", { duration: 2000 });
        setOtp(json.success.OTP);
        setStep(2);
      } else {
        toast.error(
          json.error.message === "Incorrect Credential"
            ? "Your Email or password is incorrect!"
            : json.error.message,
          { duration: 2000 }
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  if (user) {
    return <Navigate to={homeRoute} replace />;
  }

  return (
    <Page
      title="Register"
      containerStyles="!h-screen !w-screen flex justify-center items-center"
    >
      <main className="w-full max-w-xl sm:mx-4">
        <section>
          <div className="flex flex-col items-center justify-center px-2 mx-auto sm:py-8 sm:px-6 md:h-screen lg:py-0">
            <h1 className="my-5 text-xl font-bold text-center text-primary-600">
              {step === 2 ? "Verify OTP" : "Hospital Management"}
            </h1>
            <div
              className={`${
                step === 2 ? "!shadow-none !border-none w-full" : "w-full"
              } overflow-hidden bg-white border rounded-lg shadow-2xl`}
            >
              {step === 1 ? (
                <>
                  <div className="flex w-full">
                    <button
                      onClick={() => setState({ ...state, role_id: "1" })}
                      className={`w-1/2 py-3 text-sm font-medium ${
                        state.role_id === "1"
                          ? "text-primary-600"
                          : "text-gray-500 border-b border-r"
                      }`}
                    >
                      Staff
                    </button>
                    <button
                      onClick={() => setState({ ...state, role_id: "3" })}
                      className={`w-1/2 py-3 text-sm font-medium ${
                        state.role_id === "3"
                          ? "text-primary-600"
                          : "text-gray-500 border-b border-l"
                      }`}
                    >
                      Facility
                    </button>
                  </div>
                  <div className="p-6 space-y-4 md:space-y-6">
                    {/* <h1 className="text-xl font-bold leading-tight text-center text-gray-800">
                  Register
                </h1> */}
                    <form
                      className="grid grid-cols-1 space-y-2 gap-x-2 !text-sm sm:grid-cols-2"
                      onSubmit={handleSubmit}
                    >
                      <div className="col-span-2">
                        <div className="flex flex-col items-center justify-center text-xs">
                          <div
                            className="inline-block w-20 h-20 mb-2 -mt-2 overflow-hidden bg-gray-100 rounded-full cursor-pointer"
                            onClick={() =>
                              document.getElementById("profile_image").click()
                            }
                          >
                            {state.profile_image ? (
                              <img
                                className="w-full h-full text-gray-300"
                                src={URL.createObjectURL(state.profile_image)}
                                alt="profile"
                              />
                            ) : (
                              <svg
                                className="w-full h-full text-gray-300"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                            )}
                          </div>
                          {profileError && (
                            <span className="text-red-500">
                              Profile Image is required
                            </span>
                          )}

                          <input
                            id="profile_image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            name="profile_image"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <input
                          type="text"
                          name="first_name"
                          id="first_name"
                          onChange={handleChange}
                          value={state.first_name}
                          className="relative top-0 w-full px-4 py-3 text-xs font-medium text-gray-900 bg-gray-100 rounded-md outline-none focus:ring-primary-500 focus:border-primary-500 caret-primary-400"
                          placeholder="First Name"
                          required={true}
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <input
                          type="text"
                          name="last_name"
                          id="last_name"
                          onChange={handleChange}
                          value={state.last_name}
                          className="block w-full px-4 py-3 text-xs font-medium text-gray-900 bg-gray-100 rounded-md outline-none focus:ring-primary-500 focus:border-primary-500 caret-primary-400"
                          placeholder="Last Name"
                          required={true}
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          onChange={handleChange}
                          value={state.email}
                          className="block w-full px-4 py-3 text-xs font-medium text-gray-900 bg-gray-100 rounded-md outline-none focus:ring-primary-500 focus:border-primary-500 caret-primary-400"
                          placeholder="Email"
                          required={true}
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          onChange={handleChange}
                          value={state.phone}
                          className="block w-full px-4 py-3 text-xs font-medium text-gray-900 bg-gray-100 rounded-md outline-none focus:ring-primary-500 focus:border-primary-500 caret-primary-400"
                          placeholder="Phone Number"
                          required={true}
                        />
                      </div>
                      <div className="flex items-center w-full col-span-2 overflow-hidden text-xs font-medium text-gray-900 bg-gray-100 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:col-span-1">
                        <input
                          type={password.isVisible ? "text" : "password"}
                          name="password"
                          id="password"
                          onChange={handleChange}
                          value={password.value}
                          className="w-full px-4 py-3 text-gray-900 bg-gray-100 outline-none caret-primary-400"
                          placeholder="Password"
                          required={true}
                        />
                        <div className="w-10 text-lg text-primary-500">
                          {password.isVisible ? (
                            <AiFillEyeInvisible
                              onClick={togglePassword}
                              className="cursor-pointer"
                              id="password"
                            />
                          ) : (
                            <AiFillEye
                              onClick={togglePassword}
                              className="cursor-pointer"
                              id="password"
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center w-full col-span-2 overflow-hidden text-xs font-medium text-gray-900 bg-gray-100 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:col-span-1">
                        <input
                          type={
                            confirm_password.isVisible ? "text" : "password"
                          }
                          id="confirm_password"
                          name="confirm_password"
                          onChange={handleChange}
                          value={confirm_password.value}
                          className="w-full px-4 py-3 text-gray-900 bg-gray-100 outline-none caret-primary-400"
                          placeholder="Confirm Password"
                          required={true}
                        />
                        <div className="w-10 text-lg text-primary-500">
                          {confirm_password.isVisible ? (
                            <AiFillEyeInvisible
                              id="confirm_password"
                              onClick={togglePassword}
                              className="cursor-pointer"
                            />
                          ) : (
                            <AiFillEye
                              id="confirm_password"
                              onClick={togglePassword}
                              className="cursor-pointer"
                            />
                          )}
                        </div>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <input
                          type="text"
                          name="Address_line_1"
                          id="Address_line_1"
                          onChange={handleChange}
                          value={state.Address_line_1}
                          className="block w-full px-4 py-3 text-xs font-medium text-gray-900 bg-gray-100 rounded-md outline-none focus:ring-primary-500 focus:border-primary-500 caret-primary-400"
                          placeholder="Address line 1"
                          required={true}
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <input
                          type="text"
                          name="Address_line_2"
                          id="Address_line_2"
                          onChange={handleChange}
                          value={state.Address_line_2}
                          className="block w-full px-4 py-3 text-xs font-medium text-gray-900 bg-gray-100 rounded-md outline-none focus:ring-primary-500 focus:border-primary-500 caret-primary-400"
                          placeholder="Address line 2"
                          required={true}
                        />
                      </div>
                      {state.role_id === "1" && (
                        <div className="col-span-2 sm:col-span-1">
                          <DropdownField
                            title="type of staff"
                            label={false}
                            arr={staffTypes}
                            state={state.type_of_staff}
                            setState={(e) =>
                              setState({ ...state, type_of_staff: e })
                            }
                            getOption={(val) => val.service_name}
                            getValue={(val) => val.id}
                            styles="!shadow-none !rounded-md !bg-gray-100 !border-none !py-3 !outline-none !text-gray-500"
                            required
                          />
                        </div>
                      )}
                      <div className="col-span-2 sm:col-span-1">
                        <DropdownField
                          title="country"
                          label={false}
                          arr={countries}
                          state={state.country}
                          setState={(e) => setState({ ...state, country: e })}
                          getOption={(val) => val.name}
                          styles="!shadow-none !rounded-md !bg-gray-100 !border-none !py-3 !outline-none !text-gray-500"
                          required
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <DropdownField
                          title={
                            state.country ? "state" : "country to select state"
                          }
                          label={false}
                          arr={states[state.country] || []}
                          state={state.state}
                          setState={(e) => setState({ ...state, state: e })}
                          getOption={(val) => val}
                          styles="!shadow-none !rounded-md !bg-gray-100 !border-none !py-3 !outline-none !text-gray-500"
                          disabled={!state.country}
                          required
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <input
                          type="number"
                          name="zip_code"
                          id="zip_code"
                          onChange={handleChange}
                          value={state.zip_code}
                          className="block w-full px-4 py-3 text-xs font-medium text-gray-900 bg-gray-100 rounded-md outline-none focus:ring-primary-500 focus:border-primary-500 caret-primary-400"
                          placeholder="Zip code"
                          required={true}
                          maxLength={5}
                        />
                      </div>

                      <Button
                        type="submit"
                        title="Register"
                        extraStyles={`w-full !py-3 !mt-4 col-span-2`}
                        loading={loading}
                      />
                      <p className="col-span-2 mt-4 text-xs font-light text-center text-gray-500 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link
                          to="/login"
                          className="font-medium text-primary-600 hover:underline"
                        >
                          Login here
                        </Link>
                      </p>
                    </form>
                  </div>
                </>
              ) : (
                <VerifyOTP {...props} />
              )}
            </div>
          </div>
        </section>
      </main>
    </Page>
  );
};

export default Register;
