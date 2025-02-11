import React, { useEffect, useState } from "react";
import { Empty, Loader, Page } from "../../../components";
import { AppliedShiftCard } from "../../../components/Cards/Staff";
import { base_url } from "../../../utils/url";
import { useSelector } from "react-redux";

const getShifts = `${base_url}/recent-bits/`;
const getUserBookmarks = `${base_url}/get-book-marked-shifts/`;

const AppliedShifts = () => {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchShifts = async () => {
      setLoading(true);
      try {
        const res = await fetch(getShifts + user?.id);
        const json = await res.json();

        // console.log("json", json);
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
    fetchUserBookmarks();
  }, [user]);

  // console.log("userBookmarks", userBookmarks);
  // console.log("data", data);

  return (
    <Page title="Applied Shifts" enableHeader>
      <main className="relative min-h-[70vh]">
        {loading ? (
          <Loader />
        ) : data.length ? (
          <div className="flex flex-col pb-5 space-y-2">
            {data.map((item) => (
              <AppliedShiftCard
                key={item.id}
                {...item}
                user={user}
                {...item?.facility?.shift}
                description={item.description}
                isBookmarked={userBookmarks.includes(Number(item?.shift_id))}
                setUserBookmarks={setUserBookmarks}
                enableBookmarks
              />
            ))}
          </div>
        ) : (
          <Empty title="No recent shifts found!" />
        )}
      </main>
    </Page>
  );
};

export default AppliedShifts;
