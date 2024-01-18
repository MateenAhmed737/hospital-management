import React, { useContext, useState } from "react";
import { Button, Page, TextArea } from "../../components";
import { AppContext } from "../../context";
import { base_url } from "../../utils/url";
import { getInputType } from "../../utils";
import toast from "react-hot-toast";

const EditProfile = () => {
  const { user, setUser } = useContext(AppContext);
  //* console.log("user", user);
  const [state, setState] = useState(user);
  const [toggleBtn, setToggleBtn] = useState(false);

  const keys = Object.keys(state).filter(
    (e) =>
      e !== "id" &&
      e !== "updated_at" &&
      e !== "created_at" &&
      e !== "password" &&
      e !== "role" &&
      e !== "status" &&
      e !== "sin_number" &&
      e !== "discount" &&
      e !== "gst" &&
      e !== "GST" &&
      e !== "package" &&
      e !== "company_id" &&
      e !== "salary" &&
      e !== "privilage"
  );

  console.log("user ==>", user);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setToggleBtn(true);

    try {
      const url = `${base_url}/edit-company/${user.id}`;
      let formdata = new FormData();
      formdata.append(
        "type",
        user.role === "1" ? "Company" : "Project Manager"
      );
      console.log("type", user.role === "1" ? "Company" : "Project Manager");
      Object.keys(state)
        .filter((e) => e !== "role")
        .forEach((key) => {
          formdata.append(key, state[key]);
          console.log(key, state[key]);
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

        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        console.log("Response =============>", data);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(json?.message || json?.error?.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setToggleBtn(false);
    }
  };

  const handleChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;

    setState({ ...state, [key]: value });
    // if (key === "profile_image") {
    //   const file = e.target.files[0];

    //   setImage(URL.createObjectURL(file));
    //   setState({ ...state, profile_image: file });
    // } else {
    // }
  };

  return (
    <Page title="Edit Profile" enableHeader>
      <main className="max-w-2xl pb-10 mx-2 mt-10 sm:mx-auto">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          {/* <div className="col-span-2">
            <label className="block text-sm font-medium text-center text-gray-700">
              Photo
            </label>
            <div className="flex flex-col items-center mt-1 text-xs">
              <div className="inline-block w-12 h-12 overflow-hidden bg-gray-100 rounded-full">
                {image || state.profile_image ? (
                  <img
                    className="w-full h-full text-gray-300"
                    src={image || image_base_url + state.profile_image}
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
              <button
                onClick={() => document.getElementById("profile_image").click()}
                type="button"
                className="bg-white py-1.5 px-3 mt-2 border border-gray-300 rounded-md shadow-sm leading-4 font-medium text-gray-700 hover:bg-gray-50"
              >
                Change
              </button>
            </div>
          </div> */}

          {keys.map((key) =>
            key.includes("address") ? (
              <TextArea
                {...{
                  elem: key,
                  state: state[key],
                  setState: (val) => setState({ ...state, [key]: val }),
                }}
              />
            ) : (
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor={key}
                  className="block text-xs font-medium text-gray-700 capitalize"
                >
                  {key.replaceAll("_", " ")}
                </label>
                <div className="mt-1">
                  <input
                    type={getInputType(key)}
                    name={key}
                    id={key}
                    value={state[key]}
                    onChange={handleChange}
                    className="p-2.5 w-full text-xs shadow-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )
          )}
          {/* <div className="col-span-2">
            <label
              htmlFor="email"
              className="block text-xs font-medium text-gray-700"
            >
              Email
            </label>
            <div className="mt-1">
              <input
                type="tel"
                name="email"
                id="email"
                value={state.email}
                onChange={handleChange}
                className="p-2.5 w-full text-xs shadow-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+021 656 4848 315"
              />
            </div>
          </div> */}

          <div className="col-span-2 text-right">
            <Button
              type="submit"
              isLoading={toggleBtn}
              title={toggleBtn ? "Updating" : "Update"}
              extraStyles={toggleBtn ? "!py-2 !w-full" : "!py-3 !w-full"}
            />
          </div>
        </form>
      </main>
    </Page>
  );
};

export default EditProfile;
