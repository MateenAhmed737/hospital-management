import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { BiSearch } from "react-icons/bi";
import { IoCheckmark, IoCheckmarkDone } from "react-icons/io5";

import { Empty, Loader, Page } from "@/components";
import { base_url } from "@/utils/url";
import { cn } from "@/lib/utils";

const showInbox = `${base_url}/inbox/`;

const Inbox = () => {
  const user = useSelector((state) => state.user);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // console.log("data", data);

  const foundChats = useMemo(() => {
    const str = searchText.trim().toLowerCase();

    if (str) {
      return data.filter((item) => item.name?.toLowerCase()?.includes(str));
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
      <div className="relative !ml-0 w-full xs:w-auto">
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
        className={cn("relative min-h-[80vh] pt-5 space-y-1", {
          "flex justify-center items-center": loading,
        })}
      >
        <ChatList chats={foundChats} loading={loading} />
      </main>
    </Page>
  );
};

function ChatList({ loading, chats }) {
  if (loading) {
    return <Loader />;
  }

  if (!chats?.length) {
    return <Empty title="No chats found!" />;
  }

  return chats.map((item) => <Chat key={item.id} {...item} />);
}

function Chat({
  name_user_id,
  profile_image,
  status,
  created_at,
  name,
  message,
}) {
  const navigate = useNavigate();
  const isUnread = status === "unread";
  const Icon = isUnread ? IoCheckmark : IoCheckmarkDone;

  const handleClick = () => navigate("/messages/" + name_user_id);

  return (
    <button
      onClick={handleClick}
      className="flex items-center w-full px-2 py-2 space-x-3 bg-gray-100 border rounded-md hover:bg-gray-200"
    >
      <img
        className="rounded-md size-14 aspect-square"
        src={profile_image}
        alt="profile"
      />

      <div className="flex flex-col w-full text-left overflow-hidden">
        <span className="font-semibold">{name}</span>
        <span className="text-xs text-gray-500 mb-2 truncate">{message}</span>
        <div className="flex items-center justify-between text-xs">
          <span>{moment(created_at).format("DD-MMMM-YYYY")}</span>

          <span className={isUnread ? "text-gray-600" : "text-primary-500"}>
            <Icon className="inline mr-1 text-base" />
            {status}
          </span>
        </div>
      </div>
    </button>
  );
}

export default Inbox;
