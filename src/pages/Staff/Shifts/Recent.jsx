import React, { useEffect, useState } from "react";
import { Empty, JobCard, Loader, Page, RecentJobCard } from "../../../components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { base_url } from "../../../utils/url";

const getShifts = `${base_url}/pending-shift/`;

const Recent = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  console.log('data', data)
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
    <Page title="Recent Shifts" enableHeader>
      <main className="relative min-h-[70vh]">
        {loading ? (
          <Loader />
        ) : data.length ? (
          <div className="flex flex-col space-y-2">
            {data.map((shift) => (
              <RecentJobCard
                {...shift}
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

export default Recent;
