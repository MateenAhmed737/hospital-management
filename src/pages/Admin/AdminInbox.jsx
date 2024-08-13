import { useEffect, useMemo, useState } from "react";
import { Loader, Page } from "../../components";
import { adminSupportService } from "../../services";
import { useSelector } from "react-redux";
import { BiSearch } from "react-icons/bi";
import toast from "react-hot-toast";

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
      .then((res) => setChats(res.success.lastMessages))
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

  console.log("list", list);

  return list.map((item) => <InboxChatCard key={item.id} {...item} />);
}

function InboxChatCard({ name, profile_image, message, created_at }) {
  const time = useMemo(
    () =>
      new Date(created_at).toLocaleDateString().split("/").reverse().join("-"),
    [created_at]
  );

  return (
    <button className="flex items-start space-x-2 w-full bg-gray-100 p-1.5 hover:bg-gray-200 rounded-lg">
      <img
        src={profile_image}
        className="size-14 min-w-12 rounded-lg object-cover object-center"
        alt="profile"
      />

      <div className="text-start overflow-hidden *:truncate">
        <p className="text-sm font-medium text-gray-700">{name}</p>
        <p className="text-xs text-gray-700">{message}</p>
        <p className="text-xs text-gray-700">{time}</p>
      </div>
    </button>
  );
}
