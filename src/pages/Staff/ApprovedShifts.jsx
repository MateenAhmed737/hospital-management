import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Empty, Loader, Page } from "../../components";
import { ApprovedShiftCard } from "../../components/Cards/Staff";
import { base_url } from "../../utils/url";
import { cn } from "../../lib/utils";

const getShifts = `${base_url}/ongoing-shifts/`;

const ApprovedShifts = () => {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  // console.log("data", data);

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
    <Page title="Approved Shifts" enableHeader>
      <main
        className={cn("relative min-h-[80vh] pb-5 space-y-2", {
          "flex justify-center items-center": loading,
        })}
      >
        <ShiftsList loading={loading} data={data} />
      </main>
    </Page>
  );
};

function ShiftsList({ loading, data }) {
  if (loading) {
    return <Loader />;
  }

  if (!loading && !data?.length) {
    return <Empty title="No jobs yet!" />;
  }

  return data.map((item) => (
    <ApprovedShiftCard key={item.id} {...item} {...item?.shift} />
  ));
}

export default ApprovedShifts;
