import React, { useEffect, useMemo, useState } from "react";
import { base_url } from "../../../utils/url";
import { useSelector } from "react-redux";
import { Empty, Loader, Page } from "../../../components";
import { BiSearch } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { IoCheckmark, IoCheckmarkDone } from "react-icons/io5";
import { convertTime } from "../../../utils";
import moment from "moment";

const showInbox = `${base_url}/inbox/`;

const Inbox = () => {
  const user = useSelector((state) => state.user);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  console.log("data", data);

  const filteredData = useMemo(() => {
    const str = searchText.trim();

    if (str) {
      return data.filter((item) =>
        item.name?.toLowerCase()?.includes(str?.toLowerCase())
      );
    }
    return data;
  }, [data, searchText]);

  useEffect(() => {
    const fetchChats = () => {
      setLoading(true);
      fetch(showInbox + user?.id)
        .then((res) => res.json())
        .then((data) => setData(data.success.lastMessages))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    };
    fetchChats();
  }, [user]);

  return (
    <Page title="Messages" enableHeader>
      <label htmlFor="table-search" className="sr-only">
        Search
      </label>
      <div className={`relative !ml-0 w-full xs:w-auto`}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <BiSearch />
        </div>
        <input
          id="table-search"
          className="block w-full p-2 pl-10 text-xs text-gray-900 border border-gray-400 rounded-lg md:w-80 bg-gray-50 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Search by Name"
          onChange={(e) => setSearchText(e.target.value)}
          type="text"
          name="search"
          value={searchText}
        />
      </div>

      <main
        className={`relative min-h-[80vh] pt-5 ${
          loading ? "flex justify-center items-center" : ""
        }`}
      >
        {loading ? (
          <Loader />
        ) : data?.length ? (
          filteredData.map((item) => <Chat {...item} />)
        ) : (
          <Empty title="No chats found!" />
        )}
      </main>
    </Page>
  );
};

const Chat = ({ name_user_id, profile_image, status, created_at, name }) => {
  const navigate = useNavigate();
  const isUnread = status === "unread";
  const Icon = isUnread ? IoCheckmark : IoCheckmarkDone;

  return (
    <button
      onClick={() => navigate("/messages/" + name_user_id)}
      className="flex items-center w-full px-2 py-2 space-x-3 bg-gray-100 rounded-md hover:bg-gray-200"
    >
      <img className="rounded-md size-14" src={profile_image} alt="profile" />

      <div className="w-full space-y-2 text-left">
        <span className="font-semibold">{name}</span>
        <div className="flex items-center justify-between text-xs ">
          <span>{moment(created_at).format("DD-MMMM-YYYY")}</span>

          <span className={isUnread ? "text-gray-600" : "text-primary-500"}>
            <Icon className="inline mr-1 text-base" />
            {status}
          </span>
        </div>
      </div>
    </button>
  );
};

export default Inbox;
