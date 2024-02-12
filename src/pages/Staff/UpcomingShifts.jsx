import React, { useEffect, useState } from "react";
import { Empty, JobCard, Loader, Page } from "../../components";
import { base_url } from "../../utils/url";
import { useSelector } from "react-redux";

const getShifts = `${base_url}/upcomming-shift/`;

const UpcomingShifts = () => {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchShifts = async () => {
      setLoading(true);
      try {
        const res = await fetch(getShifts + user?.id);
        const json = await res.json();

        if (json.success) {
          const data = json.success.data || [];
          console.log('data', data)
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
    <Page title="Upcoming Shifts" enableHeader>
      <main className="relative min-h-[70vh]">
        {loading ? (
          <Loader />
        ) : data.length ? (
          <div className="flex flex-col space-y-2">
            {data.map((shift) => (
              shift.id !== 81 && <JobCard data={shift} {...shift} facility={shift.facility} />
            ))}
          </div>
        ) : (
          <Empty title="No shifts found!" />
        )}
      </main>
    </Page>
  );
};

export default UpcomingShifts;
