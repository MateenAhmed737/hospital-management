import React, { useEffect, useMemo, useState } from "react";
import { fetchData } from "../../../utils";
import { base_url } from "../../../utils/url";
import { useSelector } from "react-redux";
import { Empty, Loader, Page } from "../../../components";
import { BiSearch } from "react-icons/bi";

const showInbox = `${base_url}/inbox/`;

const Inbox = () => {
  const user = useSelector((state) => state.user);
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const filteredData = useMemo(() => {
    const str = searchText.trim();

    if (str) {
      return data.filter((item) =>
        item.name?.toLowerCase()?.includes(str?.toLowerCase())
      );
    } else {
      return data;
    }
  }, [data, searchText]);

  useEffect(() => {
    fetchData({
      setIsLoading: setLoading,
      // requestOptions,
      url: showInbox + user?.id,
      sort: (data) => data?.sort((a, b) => b.id - a.id),
      callback: (data) => {
        setData(data);
      },
    });
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
        className={`relative min-h-[80vh] ${
          loading ? "flex justify-center items-center" : ""
        }`}
      >
        {loading ? (
          <Loader />
        ) : data?.length ? (
          filteredData.map((item) => <div>test</div>)
        ) : (
          <Empty title="No chats found!" />
        )}
      </main>
    </Page>
  );
};

export default Inbox;
