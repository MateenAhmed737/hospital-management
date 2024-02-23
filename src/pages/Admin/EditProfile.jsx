import React, { useState } from "react";
import { Button, DropdownField, Page } from "../../components";
import { base_url } from "../../utils/url";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { countries, roles, states } from "../../constants/data";
import { userActions } from "../../store/slices/userSlice";

const EditProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [state, setState] = useState({ ...user, about: "" });
  const [loading, setLoading] = useState(false);

  const { profile_image } = state;

  console.log("user ==>", user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = `${base_url}/update-user/${user.id}`;
      let formdata = new FormData();

      Object.keys(state)
        .filter((e) => e !== "role")
        .forEach((key) => {
          if (key === "type") {
            formdata.append("type_of_staff", state[key]);
            console.log("type_of_staff", state[key]);
          } else {
            formdata.append(key, state[key]);
            console.log(key, state[key]);
          }
        });

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

      console.log("json", json);
      if (json.success) {
        let data = json.success.data;
        data.role = roles[data.role_id];
        data.isStaff = data.role_id === "1";
        data.isAdmin = data.role_id === "2";
        data.isFacility = data.role_id === "3";

        dispatch(userActions.set(data));
        console.log("Response =============>", data);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(json?.message || json?.error?.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;

    if (key === "profile_image") {
      const file = e.target.files[0];
      setState({ ...state, profile_image: file });
    } else {
      setState({ ...state, [key]: value });
    }
  };

  return (
    <Page title="Edit Profile" enableHeader>
      <main className="max-w-xl p-6 mx-auto space-y-4 md:space-y-6">
        <form
          className="grid grid-cols-1 space-y-2 gap-x-2 !text-sm sm:grid-cols-2"
          onSubmit={handleSubmit}
        >
          <div className="col-span-2">
            <div className="flex flex-col items-center justify-center text-xs">
              <div
                className="inline-block w-20 h-20 mb-2 -mt-2 overflow-hidden bg-gray-100 rounded-full cursor-pointer"
                onClick={() => document.getElementById("profile_image").click()}
              >
                {profile_image ? (
                  <img
                    className="w-full h-full text-gray-300"
                    src={
                      typeof profile_image === "string"
                        ? profile_image
                        : URL.createObjectURL(profile_image)
                    }
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
            />
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
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <DropdownField
              title="country"
              label={false}
              arr={countries}
              state={state.country}
              setState={(e) => setState({ ...state, country: e })}
              getOption={(val) => val.name}
              styles="!shadow-none !rounded-md !bg-gray-100 !border-none !py-3 !outline-none disabled:!text-gray-500"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <DropdownField
              title={state.country ? "state" : "country to select state"}
              label={false}
              arr={states[state.country] || []}
              state={state.state}
              setState={(e) => setState({ ...state, state: e })}
              getOption={(val) => val}
              styles="!shadow-none !rounded-md !bg-gray-100 !border-none !py-3 !outline-none disabled:!text-gray-500"
              disabled={!state.country}
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
              maxLength={5}
            />
          </div>
          <div className="col-span-2">
            <textarea
              name="about"
              rows="8"
              onChange={handleChange}
              value={state.about}
              className="block w-full px-4 py-3 text-xs font-medium text-gray-900 bg-gray-100 rounded-md outline-none focus:ring-primary-500 focus:border-primary-500 caret-primary-400"
              placeholder="About..."
            ></textarea>
          </div>

          <Button
            type="submit"
            title="Update"
            extraStyles={`w-full !py-3 !mt-4 col-span-2`}
            loading={loading}
          />
        </form>
      </main>
    </Page>
  );
};

export default EditProfile;
