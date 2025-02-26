import React from "react";
import { VscClose } from "react-icons/vsc";
import {
  FaBuilding,
  FaInfoCircle,
  FaPaperPlane,
  FaPhoneAlt,
  FaUser,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

import { base_url } from "@/utils/url";
import { Loader } from "@/components/Loaders";
import { Rating } from "@/components/Cards";

const getProfile = `${base_url}/get-user/`;

const ProfileViewModal = ({ profileModal, setProfileModal }) => {
  const [profileInfo, setProfileInfo] = React.useState({
    data: null,
    loading: true,
  });
  const [tab, setTab] = React.useState(0);
  const user_id = profileModal.user_id;
  const role_id = profileModal.role_id;

  const close = () =>
    setProfileModal((prev) => ({
      ...prev,
      isOpen: false,
      user_id: null,
      role_id: null,
    }));

  React.useEffect(() => {
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
                  {profileInfo.data?.profile_image ? (
                    <img
                      className="object-cover object-center mx-auto rounded-full size-24"
                      src={profileInfo.data?.profile_image}
                      alt="profile"
                    />
                  ) : (
                    <div className="flex items-center justify-center mx-auto text-4xl text-gray-300 bg-gray-100 rounded-full size-24">
                      <FaUser />
                    </div>
                  )}
                  <h3 className="mt-2 font-semibold text-center capitalize">
                    {profileInfo.data.first_name} {profileInfo.data.last_name}
                  </h3>
                  <div className="flex w-full">
                    <button
                      onClick={() => setTab(0)}
                      className={`w-1/2 py-2 mt-2 text-xs font-medium border-b-2 ${
                        tab === 0
                          ? "text-primary-600 border-primary-600"
                          : "text-gray-500"
                      }`}
                    >
                      Info
                    </button>
                    <button
                      onClick={() => setTab(1)}
                      className={`w-1/2 py-2 mt-2 text-xs font-medium border-b-2 ${
                        tab === 1
                          ? "text-primary-600 border-primary-600"
                          : "text-gray-500"
                      }`}
                    >
                      Reviews
                    </button>
                  </div>
                  {tab === 0 && (
                    <div className="mt-2 text-sm text-left">
                      <table className="w-full overflow-hidden rounded-lg">
                        <tbody className="border">
                          <tr className="py-2 text-xs text-left text-gray-600 bg-gray-50 hover:bg-gray-200">
                            <td
                              colSpan={2}
                              className="px-2 py-2 font-semibold capitalize align-middle"
                            >
                              <FaUser className="text-base mr-2.5 inline-block" />
                              {`${profileInfo.data?.first_name} ${profileInfo.data?.last_name}`}
                            </td>
                            <td className="text-xs text-gray-700"></td>
                          </tr>
                          <tr className="py-2 text-xs text-left text-gray-600 bg-gray-50 hover:bg-gray-200">
                            <td
                              colSpan={2}
                              className="px-2 py-2 font-semibold capitalize align-middle"
                            >
                              <MdEmail className="text-lg mr-2.5 inline-block" />
                              {profileInfo.data?.email}
                            </td>
                            <td className="text-xs text-gray-700"></td>
                          </tr>
                          <tr className="py-2 text-xs text-left text-gray-600 bg-gray-50 hover:bg-gray-200">
                            <td
                              colSpan={2}
                              className="px-2 py-2 font-semibold capitalize align-middle"
                            >
                              <FaPhoneAlt className="text-base mr-2.5 inline-block" />
                              {profileInfo.data?.phone}
                            </td>
                            <td className="text-xs text-gray-700"></td>
                          </tr>
                          <tr className="py-2 text-xs text-left text-gray-600 bg-gray-50 hover:bg-gray-200">
                            <td
                              colSpan={2}
                              className="px-2 py-2 font-semibold capitalize align-middle"
                            >
                              <FaInfoCircle className="text-base mr-2.5 inline-block" />
                              {profileInfo.data?.about}
                            </td>
                            <td className="text-xs text-gray-700"></td>
                          </tr>
                          <tr className="py-2 text-xs text-left text-gray-600 bg-gray-50 hover:bg-gray-200">
                            <td
                              colSpan={2}
                              className="px-2 py-2 font-semibold capitalize align-middle"
                            >
                              <FaPaperPlane className="text-base mr-2.5 inline-block" />
                              {profileInfo.data?.Address_line_1}
                            </td>
                            <td className="text-xs text-gray-700"></td>
                          </tr>
                          <tr className="py-2 text-xs text-left text-gray-600 bg-gray-50 hover:bg-gray-200">
                            <td
                              colSpan={2}
                              className="px-2 py-2 font-semibold capitalize align-middle"
                            >
                              <FaPaperPlane className="text-base mr-2.5 inline-block" />
                              {profileInfo.data?.Address_line_2}
                            </td>
                            <td className="text-xs text-gray-700"></td>
                          </tr>
                          <tr className="py-2 text-xs text-left text-gray-600 bg-gray-50 hover:bg-gray-200">
                            <td
                              colSpan={1}
                              className="px-2 py-2 font-semibold capitalize align-middle"
                            >
                              <FaBuilding className="text-base mr-2.5 inline-block" />
                              {profileInfo.data?.country}
                            </td>
                            <td
                              colSpan={1}
                              className="px-2 py-2 font-semibold capitalize align-middle"
                            >
                              <FaBuilding className="text-base mr-2.5 inline-block" />
                              {profileInfo.data?.state}
                            </td>
                            <td className="text-xs text-gray-700"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div
                    className={
                      tab === 1 &&
                      (profileInfo.data?.review?.length
                        ? "flex flex-col space-y-1 pt-2 min-h-[38vh]"
                        : "flex justify-center items-center min-h-[38vh] text-xs")
                    }
                  >
                    {tab === 1 && profileInfo.data?.review?.length
                      ? profileInfo.data.review.map((review) => (
                          <div
                            key={review.id}
                            className="w-full px-3 py-2 space-y-1 border rounded-md"
                          >
                            <div className="flex items-center justify-between text-sm">
                              <b>{review?.hospital}</b>

                              <div className="flex items-center space-x-0.5">
                                <Rating stars={review.stars} />(
                                {Number(review.stars).toFixed(1)})
                              </div>
                            </div>

                            <p className="text-xs">{review.content}</p>
                          </div>
                        ))
                      : tab === 1 &&
                        !profileInfo.data?.review?.length &&
                        "No reviews found!"}
                  </div>
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
