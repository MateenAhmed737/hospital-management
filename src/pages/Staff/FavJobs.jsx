import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Empty, Loader, Page } from "@/components";
import { AppliedShiftCard } from "@/components/Cards/Staff";
import { base_url } from "@/utils/url";

const getShifts = `${base_url}/get-book-marked-shifts/`;

const FavJobs = () => {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  // console.log("data", data);

  useEffect(() => {
    if (!user) return;

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
    <Page title="Favourite Jobs" enableHeader>
      <div className="flex items-center justify-between mt-2 text-xs">
        <span className="ml-1 font-medium">All Result</span>
        <span>
          {data?.length} job{data?.length > 1 && "s"} found
        </span>
      </div>

      <main
        className={`relative min-h-[80vh] py-5 space-y-2 ${
          loading ? "flex justify-center items-center" : ""
        }`}
      >
        {loading ? (
          <Loader />
        ) : data?.length ? (
          data.map((item) => (
            <AppliedShiftCard
              key={item.id}
              user={user}
              {...item}
              {...item.facility?.shift}
              isBookmarked={true}
              // setUserBookmarks={setData}
              onSuccess={() => setData(data.filter((e) => e.id !== item.id))}
              enableBookmarks
            />
          ))
        ) : (
          <Empty title="No jobs found!" />
        )}
      </main>
    </Page>
  );
};

export default FavJobs;
