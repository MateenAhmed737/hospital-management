import moment from "moment";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";

import { base_url } from "@/utils/url";
import { formatNumbers } from "@/utils";
import { Empty, Loader, Page, ShiftModal } from "@/components";

const getShifts = `${base_url}/get-country-wise-shifts/`;
const bookmark = `${base_url}/book-marked-shifts`;
const getBidsUser = `${base_url}/recent-bits/`;
const getUserBookmarks = `${base_url}/get-book-marked-shifts/`;

const AllJobs = () => {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [userBids, setUserBids] = useState([]);
  const [reload, setReload] = useState(false);
  const [userBookmarks, setUserBookmarks] = useState([]);

  // console.log("data", data);

  const filteredData = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (query) {
      return data.filter((item) =>
        ["title", "description"].some((key) =>
          item[key]?.toLowerCase()?.includes(query)
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
          setData(data);
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
          setUserBids(data?.map((e) => Number(e?.shift_id)));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    const fetchUserBookmarks = async () => {
      setLoading(true);
      try {
        const res = await fetch(getUserBookmarks + user?.id);
        const json = await res.json();

        if (json.success) {
          const data = json.success.data || [];
          setUserBookmarks(data.map((e) => Number(e.shift_id)));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
    fetchUserBids();
    fetchUserBookmarks();
  }, [user, reload]);

  // console.log("userBookmarks", userBookmarks);

  return (
    <Page title="All Jobs" enableHeader>
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
              key={item.id}
              {...item}
              user={user}
              bidPlacedAlready={userBids.includes(item.id)}
              isBookmarked={userBookmarks.includes(item.id)}
              setUserBookmarks={setUserBookmarks}
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
  const [bookmarking, setBookmarking] = useState(false);

  const handleBookmark = () => {
    setBookmarking(true);

    const formdata = new FormData();
    formdata.append("user_id", data?.user?.id);
    fetch(`${bookmark}/${data.id}`, {
      method: "POST",
      body: formdata,
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log("res", res);
        if (res.status === 200) {
          data.setUserBookmarks((prev) =>
            data.isBookmarked
              ? prev.filter((e) => e != res.data.shift_id)
              : [...prev, Number(res.data.shift_id)]
          );
          toast.success(res.message, { duration: 2000 });
        } else if (res.error) {
          toast.error(res?.error?.message);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setBookmarking(true);
      });
  };

  return (
    <div className="relative">
      <button
        className="absolute text-primary-500 top-2 right-2"
        onClick={handleBookmark}
        disabled={bookmarking}
      >
        {data.isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
      </button>
      <button
        onClick={() => setShiftModal(true)}
        className="flex flex-col w-full p-2 py-1.5 bg-gray-100 border rounded-md"
      >
        <div className="flex items-center justify-between w-full p-1 pb-1.5 border-b-2">
          <div className="flex items-center w-full">
            {data.facility?.profile_image ? (
              <img
                src={data.facility?.profile_image}
                className="rounded-md w-11 h-11 aspect-square object-cover"
                alt="facility profile"
              />
            ) : (
              <div className="flex items-center justify-center bg-gray-200 rounded-md size-11">
                <HiMiniBuildingOffice className="text-2xl text-gray-400" />
              </div>
            )}

            <p className="text-sm ml-2 mb-5 font-semibold w-full text-start">
              {data.title}
            </p>
            <div className="text-sm flex flex-col text-nowrap text-start justify-end">
              <p className="text-sm font-semibold text-primary-500">
                {formatNumbers(data.total_service_amount, "currency")}
              </p>
              <p className="text-xs font-semibold text-primary-500">
                Est Amount
              </p>
            </div>
          </div>
        </div>

        <div className="w-full text-left">
          <span className="text-xs">{data.description}</span>

          <div className="flex flex-col items-start mt-1 text-xs text-gray-600">
            <span>
              <strong className="font-medium">Shift Date:</strong>{" "}
              {moment(data.created_at).format("YYYY-MM-DD")}
            </span>
            <span>
              <strong className="font-medium">Shift Timing:</strong>{" "}
              {data.start_time} to {data.end_time}
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

export default AllJobs;
