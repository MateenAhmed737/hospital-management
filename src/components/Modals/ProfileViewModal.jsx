import React, { useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";
import { base_url } from "../../utils/url";
import { Loader } from "../Loaders";

const getProfile = `${base_url}/get-user/`;

const ProfileViewModal = ({ profileModal, setProfileModal }) => {
  const [profileInfo, setProfileInfo] = useState({ data: null, loading: true });
  const [tab, setTab] = useState(0);
  const user_id = profileModal.user_id;
  const role_id = profileModal.role_id;

  const close = () =>
    setProfileModal((prev) => ({
      ...prev,
      isOpen: false,
      user_id: null,
      role_id: null,
    }));

  useEffect(() => {
    if (user_id && role_id) {
      const fetchProfileInfo = () => {
        setProfileInfo((prev) => ({ ...prev, loading: true }));
        fetch(`${getProfile + user_id}/${role_id}`)
          .then((res) => res.json())
          .then((res) => {
            setProfileInfo((prev) => ({ ...prev, data: res.success.data }));
          })
          .catch((err) => console.error(err))
          .finally(() => {
            setProfileInfo((prev) => ({ ...prev, loading: false }));
          });
      };

      fetchProfileInfo();
    }
  }, [user_id, role_id]);

  console.log("profileInfo.data", profileInfo.data);

  return (
    <>
      <div
        onClick={close}
        className={`${
          profileModal.isOpen ? "" : "hidden"
        } fixed inset-0 flex justify-center items-center z-20 bg-black/50`}
      />
      <div
        tabIndex="-1"
        className={`${
          profileModal.isOpen ? "" : "hidden"
        } fixed z-20 pointer-events-none flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto inset-0 h-full`}
      >
        <div className="relative w-full max-w-lg max-h-full pointer-events-auto">
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow">
            {/* Modal header */}
            <div className="flex items-start justify-between p-4 py-3 border-b rounded-t">
              <h3 className="text-lg font-semibold text-gray-900">
                Profile Info
              </h3>
              <button
                onClick={close}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-base p-1.5 ml-auto inline-flex items-center"
              >
                <VscClose />
              </button>
            </div>
            {/* Modal body */}
            <div className="relative p-5 px-3 space-y-6 max-h-[72vh] min-h-[50vh] overflow-y-scroll">
              {profileInfo.loading ? (
                <Loader />
              ) : (
                <div className="w-full">
                  <img
                    className="object-cover object-center mx-auto rounded-full size-24"
                    src={profileInfo.profile_image}
                    alt="profile"
                  />
                  <h3 className="mt-2 font-semibold text-center capitalize">
                    {profileInfo.data.first_name} {profileInfo.data.last_name}
                  </h3>
                  <div className="flex w-full">
                    <button
                      onClick={() => setTab(0)}
                      className={`w-1/2 py-3 text-xs font-medium border-b-2 ${
                        tab === 0
                          ? "text-primary-600 border-primary-600"
                          : "text-gray-500"
                      }`}
                    >
                      Info
                    </button>
                    <button
                      onClick={() => setTab(1)}
                      className={`w-1/2 py-3 text-xs font-medium border-b-2 ${
                        tab === 1
                          ? "text-primary-600 border-primary-600"
                          : "text-gray-500"
                      }`}
                    >
                      Reviews
                    </button>
                  </div>
                  {tab === 0 && (
                    <div className="mt-2 text-xs text-left">
                      <table className="w-full overflow-hidden rounded-lg">
                        <tbody className="border">
                          <tr className="py-1 text-xs text-left text-gray-600 bg-gray-50 hover:bg-gray-200">
                            <th className="px-2 py-1.5 font-semibold">
                              Due Date:
                            </th>
                            <td className="text-xs text-gray-700">
                              {profileInfo.data?.due_date}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Modal footer */}
            <div className="flex items-center p-4 border-t border-gray-200 rounded-b">
              <button
                onClick={close}
                type="button"
                className="w-full text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileViewModal;
