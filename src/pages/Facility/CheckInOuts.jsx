import React, { useEffect, useState } from "react";
import { Empty, Loader, Page } from "../../components";
import { base_url } from "../../utils/url";
import { useSelector } from "react-redux";
import AllChecksCard from "../../components/Cards/Facility/AllChecksCard";

const getCheckInOuts = `${base_url}/user-job-details/`;

const CheckInOuts = () => {
  const user = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCheckInOuts = () => {
      setLoading(true);

      fetch(getCheckInOuts + user?.id)
        .then((res) => res.json())
        .then((res) => setData(res.success.data.slice().reverse()))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    };

    fetchCheckInOuts();
  }, [user]);

  return (
    <Page title="All Check In/Out" enableHeader>
      <main className="relative min-h-[80vh] flex flex-col">
        {loading ? (
          <Loader />
        ) : data.length > 0 ? (
          data.map((item) => <AllChecksCard {...item} setData={setData} />)
        ) : (
          <Empty title="No Check In/Out for today!" />
        )}
      </main>
    </Page>
  );
};

export default CheckInOuts;
