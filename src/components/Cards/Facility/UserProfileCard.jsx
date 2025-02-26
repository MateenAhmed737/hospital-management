import React from "react";
import { ProfileViewModal } from "@/components/Modals";
import { FaUser } from "react-icons/fa";
import { Button } from "@/components/Buttons";

export default function UserProfileCard(profileInfo) {
  const [profileModal, setProfileModal] = React.useState({ isOpen: false });

  return (
    <>
      <div className="flex items-center justify-between p-2 my-1 border rounded-lg hover:bg-gray-100 bg-gray-50">
        <div className="flex items-start space-x-3 text-start">
          {profileInfo?.profile_image ? (
            <img
              className="object-cover object-center mx-auto rounded-lg size-[52px]"
              src={profileInfo?.profile_image}
              alt="profile"
            />
          ) : (
            <div className="flex items-center justify-center mx-auto text-4xl text-gray-300 bg-gray-100 rounded-full size-24">
              <FaUser />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold capitalize">
              {profileInfo?.shift?.title}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              <span className="font-semibold text-sm text-gray-700">
                {profileInfo?.first_name} {profileInfo?.last_name}
              </span>
              <br />
              <span>
                {profileInfo?.state}, {profileInfo?.country}
              </span>
              <br />
              <span>Service Type: {profileInfo?.type || "-"}</span>
            </p>
          </div>
        </div>
        <Button
          handleClick={() =>
            setProfileModal({
              isOpen: true,
              ...profileInfo,
              user_id: profileInfo.id,
            })
          }
        >
          View profile
        </Button>
      </div>
      <ProfileViewModal
        profileModal={profileModal}
        setProfileModal={setProfileModal}
      />
    </>
  );
}
