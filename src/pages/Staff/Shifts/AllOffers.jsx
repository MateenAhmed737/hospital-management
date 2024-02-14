import React, { useEffect, useMemo, useState } from "react";
import { Empty, Loader, Page, RecentJobCard } from "../../../components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { base_url } from "../../../utils/url";
import { BiSearch } from "react-icons/bi";

const getShifts = `${base_url}/get-country-wise-shifts/`;

const AllOffers = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");

  console.log("data", data);

  const filteredData = useMemo(() => {
    const str = searchText.trim();

    if (str) {
      return data.filter((item) =>
        ["title", "description"].some((key) =>
          item[key]?.toLowerCase()?.includes(str?.toLowerCase())
        )
      );
    }
    return data;
  }, [data, searchText]);

  useEffect(() => {
    const fetchShifts = async () => {
      setLoading(true);
      try {
        const res = await fetch(getShifts + user?.id);
        const json = await res.json();

        if (json.success) {
          const data = json.success.data || [];
          setData(data.slice().reverse());
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, [user]);

  return (
    <Page title="Shift Offers" enableHeader>
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
          placeholder="Search by Title or Description"
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
        ) : filteredData?.length ? (
          filteredData.map((item) => <RecentJobCard {...item} />)
        ) : (
          <Empty title="No shifts found!" />
        )}
      </main>
    </Page>
  );
};

export default AllOffers;
