import React, { useEffect, useState } from "react";
import { Empty, Loader, Page } from "../../components";
import { useSelector } from "react-redux";
import { base_url } from "../../utils/url";
import { AppliedShiftCard } from "../../components/Cards/Staff";

const getShifts = `${base_url}/ongoing-shifts/`;

const AwardedJobs = () => {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  console.log("data", data);

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
    <Page title="Awarded Jobs" enableHeader>
      {/* <div className="flex items-center justify-between mt-2 text-xs">
        <span className="ml-1 font-medium">All Result</span>
        <span>{data?.length} jobs found</span>
      </div> */}

      <main
        className={`relative min-h-[80vh] pb-5 space-y-2 ${
          loading ? "flex justify-center items-center" : ""
        }`}
      >
        {loading ? (
          <Loader />
        ) : data?.length ? (
          data.map((item) => <AppliedShiftCard {...item} {...item?.shift} />)
        ) : (
          <Empty title="No jobs found!" />
        )}
      </main>
    </Page>
  );
};

export default AwardedJobs;
