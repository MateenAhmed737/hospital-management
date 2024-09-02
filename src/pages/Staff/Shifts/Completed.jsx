import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { roles } from "@/constants/data";
import { Empty, Loader, Page } from "@/components";
import { CompletedJobCard } from "@/components/Cards/Staff";

const Completed = () => {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchShifts = async () => {
      setLoading(true);

      const type = user.role_id == "1" ? "User" : roles[user.role_id];

      axios
        .post("/approved-shift/" + user.id, { type })
        .then((res) => res.data)
        .then((res) => setData(res?.success?.data || []))
        .finally(() => setLoading(false));
    };

    fetchShifts();
  }, [user]);

  return (
    <Page title="Completed Shifts" enableHeader>
      <main className="relative min-h-[80vh]">
        {loading ? (
          <Loader />
        ) : data?.length ? (
          <div className="flex flex-col space-y-2">
            {data.map((shift) => (
              <CompletedJobCard key={shift.id} {...shift} />
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
