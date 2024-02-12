import React, { useEffect, useState } from "react";
import { CompletedJobCard, Empty, JobCard, Loader, Page } from "../../../components";
import { base_url } from "../../../utils/url";
import { useSelector } from "react-redux";

const getShifts = `${base_url}/approved-shift/`;

const Completed = () => {
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
          setData(data);
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
    <Page title="Completed Shifts" enableHeader>
      <main className="relative min-h-[80vh]">
        {loading ? (
          <Loader />
        ) : data.length ? (
          <div className="flex flex-col space-y-2">
            {data.map((shift) => (
              <CompletedJobCard
                {...shift}
                disableBids
              />
            ))}
          </div>
        ) : (
          <Empty title="No shifts found!" />
        )}
      </main>
    </Page>
  );
};

export default Completed;
