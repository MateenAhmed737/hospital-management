import React, { useEffect, useMemo, useState } from "react";
import { Empty, Loader, Page, ShiftModal } from "../../components";
import { useSelector } from "react-redux";
import { base_url } from "../../utils/url";
import { BiSearch } from "react-icons/bi";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { FaBookmark } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { FaRegClock } from "react-icons/fa6";
import moment from "moment";

const getShifts = `${base_url}/upcomming-shift/`;
const bookmark = `${base_url}/book-marked-shifts`;
const getBidsUser = `${base_url}/recent-bits/`;

const RecentJobs = () => {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [userBids, setUserBids] = useState([]);
  const [reload, setReload] = useState(false);

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
    const fetchUserBids = async () => {
      setLoading(true);
      try {
        const res = await fetch(getBidsUser + user?.id);
        const json = await res.json();

        if (json.success) {
          const data = json.success.data || [];
          console.log("data", data);
          setUserBids(data?.map((e) => Number(e?.shift_id)));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBids();
    fetchShifts();
  }, [user, reload]);

  console.log("userBids", userBids);

  return (
    <Page title="Recent Jobs" enableHeader>
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
      <div className="flex items-center justify-between mt-2 text-xs">
        <span className="ml-1 font-medium">Search Result</span>
        <span>{filteredData?.length} jobs found</span>
      </div>

      <main
        className={`relative min-h-[80vh] pt-5 space-y-2 pb-5 ${
          loading ? "flex justify-center items-center" : ""
        }`}
      >
        {loading ? (
          <Loader />
        ) : data?.length ? (
          filteredData.map((item) => (
            <RecentJob
              {...item}
              user={user}
              bidPlacedAlready={userBids.includes(item.id)}
              reload={() => setReload(!reload)}
            />
          ))
        ) : (
          <Empty title="No shifts found!" />
        )}
      </main>
    </Page>
  );
};

const RecentJob = (data) => {
  const [shiftModal, setShiftModal] = useState(false);

  const handleBookmark = () => {
    const formdata = new FormData();
    formdata.append("user_id", data?.user?.id);
    fetch(`${bookmark}/${data.shift_id}`, {
      method: "POST",
      body: formdata,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("res", res);
        if (res.success) {
          console.log(res.success.data);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="relative">
      <button
        className="absolute text-primary-500 top-2 right-2"
        onClick={handleBookmark}
      >
        <FaBookmark />
      </button>
      <button
        onClick={() => setShiftModal(true)}
        className="flex flex-col w-full p-2 py-1.5 bg-gray-100 border rounded-md"
      >
        <div className="flex items-center justify-between w-full p-1">
          <div className="flex items-center">
            {data.facility?.profile_image ? (
              <img
                src={data.facility?.profile_image}
                className="rounded-md w-11 h-11"
                alt="facility profile"
              />
            ) : (
              <div className="flex items-center justify-center bg-gray-200 rounded-md size-11">
                <HiMiniBuildingOffice className="text-2xl text-gray-400" />
              </div>
            )}

            <p className="flex flex-col items-start ml-2 text-sm">
              <span className="text-sm font-semibold">{data.title}</span>
              <span className="text-xs">${data.service_amount}/hr</span>
            </p>
          </div>
        </div>

        <div className="w-full text-left">
          <span className="text-xs">{data.description}</span>

          <div className="flex items-center justify-between mt-1">
            <span className="text-xs">
              <CiLocationOn className="inline mb-0.5 mr-0.5 text-sm" />
              {data.state}, {data.facility.country}
            </span>
            <span className="text-xs">
              <FaRegClock className="inline mb-1 mr-1" />
              {moment(data.created_at).format("DD/MM/YYYY, hh:mm A")}
            </span>
          </div>
        </div>
      </button>

      {shiftModal && (
        <ShiftModal
          shiftModal={shiftModal}
          setShiftModal={setShiftModal}
          data={{ ...data, ...data.facility.shift }}
          disableBids={data.bidPlacedAlready}
          reload={data.reload}
        />
      )}
    </div>
  );
};

export default RecentJobs;
