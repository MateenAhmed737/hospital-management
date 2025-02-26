import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Empty, Loader, Page } from "@/components";
import { UserProfileCard } from "@/components/Cards/Facility";
import { base_url } from "@/utils/url";
import { BiSearch } from "react-icons/bi";

const getUsers = `${base_url}/get-users`;
const getTypes = `${base_url}/get-services`;

export default function SearchUsers() {
  const user = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState([]);
  const [searchText, setSearchText] = useState("");

  const filteredData = React.useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (query) {
      return data.filter(
        (item) =>
          item.first_name?.toLowerCase()?.includes(query) ||
          item.last_name?.toLowerCase()?.includes(query)
      );
    }
    return data;
  }, [data, searchText]);

  useEffect(() => {
    const fetchSearchUsers = () => {
      setLoading(true);

      fetch(getUsers)
        .then((res) => res.json())
        .then((res) => setData(res.success.data.slice().reverse()))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    };
    const fetchTypes = () => {
      setLoading(true);

      fetch(getTypes)
        .then((res) => res.json())
        .then((res) => setTypes(res.success.data.slice()))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    };

    fetchSearchUsers();
    fetchTypes();
  }, [user]);

  return (
    <Page title="Search Users" enableHeader>
      <label htmlFor="table-search" className="sr-only">
        Search
      </label>
      <div className="relative !ml-0 w-full xs:w-auto mb-2">
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
      <main className="relative min-h-[80vh] flex flex-col">
        {loading ? (
          <Loader />
        ) : filteredData.length > 0 ? (
          filteredData.map((item) => (
            <UserProfileCard
              key={item?.id}
              {...item}
              type={types.find((e) => e.id == item.type_id)?.service_name}
            />
          ))
        ) : (
          <Empty title="No users found." />
        )}
      </main>
    </Page>
  );
}
