import { useEffect, useMemo, useState } from "react";
import { Loader, Page } from "../../../components";
import { adminSupportService } from "../../../services";
import { useSelector } from "react-redux";
import { BiSearch } from "react-icons/bi";
import toast from "react-hot-toast";
import moment from "moment";
import { cn } from "../../../lib/utils";
import { FaUser } from "react-icons/fa6";
import { MdPermMedia } from "react-icons/md";
import { Link } from "react-router-dom";

const searchableKeys = ["name"];

export default function AdminInbox() {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [chats, setChats] = useState([]);

  const filteredList = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return chats;

    return chats.filter((chat) =>
      searchableKeys.some((key) => chat[key].toLowerCase().includes(query))
    );
  }, [chats, searchText]);

  useEffect(() => {
    setLoading(true);
    adminSupportService
      .get_inbox(user.id)
      .then((res) => setChats(res.success.data))
      .catch((err) => {
        toast.error("An error occurred! Please try again later");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [user.id]);

  return (
    <Page title="Admin Inbox" enableHeader>
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
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="relative min-h-[50vh] space-y-2 py-3">
        <InboxList loading={loading} list={filteredList} />
      </div>
    </Page>
  );
}

function InboxList({ loading, list }) {
  if (loading) {
    return <Loader />;
  }

  return list.map((item) => <InboxChatCard key={item.id} {...item} />);
}

function InboxChatCard({
  message_id,
  other_user_id,
  name,
  profile_picture,
  data_type,
  user_massage,
  created_at,
}) {
  const isTextMessage = data_type === "text";
  const fileName = useMemo(
    () => !isTextMessage && user_massage.split("/").slice(-1),
    [user_massage, isTextMessage]
  );
  const time = useMemo(
    () =>
      created_at ? moment(new Date(created_at)).format("DD-MMMM-YYYY") : "-",
    [created_at]
  );

  return (
    <Link
      to={"/admin-inbox/" + other_user_id}
      state={{
        message_id,
        other_user_id,
        name,
        profile_picture,
        data_type,
        user_massage,
        created_at,
      }}
      className="flex items-start space-x-2 w-full p-1.5 hover:bg-gray-50 rounded-lg"
    >
      <ProfileImage src={profile_picture} />

      <div className="text-start overflow-hidden *:truncate">
        <p className="text-sm font-medium text-gray-700">{name}</p>
        <p className="text-xs text-gray-700 mt-1.5">
          {isTextMessage ? (
            user_massage
          ) : (
            <MdPermMedia className="inline text-sm mr-1" />
          )}{" "}
          {fileName}
        </p>
        <p className="text-xs text-gray-500 font-light">{time}</p>
      </div>
    </Link>
  );
}

function ProfileImage({ src, className }) {
  if (!src) {
    return (
      <div className="size-14 min-w-12 rounded-lg bg-gray-100 flex justify-center items-center text-gray-300 text-3xl">
        <FaUser />
      </div>
    );
  }

  return (
    <img
      src={src}
      className={cn(
        "size-14 min-w-12 rounded-lg object-cover object-center",
        className
      )}
      alt="profile"
    />
  );
}
