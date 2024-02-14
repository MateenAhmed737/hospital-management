import React, { useEffect, useState } from "react";
import { Empty, Loader, Page } from "../../../components";
import { base_url } from "../../../utils/url";
import { useSelector } from "react-redux";
import { AllShiftCard } from "../../../components/Cards/Facility";

const getShifts = `${base_url}/get-shift/`;

const AllFacilityShifts = () => {
  const user = useSelector((state) => state.user);
  const [shifts, setShifts] = useState({ loading: true, data: [] });

  console.log(shifts)

  useEffect(() => {
    const fetchShifts = () => {
      setShifts({ loading: true, data: [] });

      fetch(getShifts + user?.id)
        .then((res) => res.json())
        .then((res) => {
          const data = res.success.data || [];
          setShifts({ loading: false, data });
        })
        .catch((err) => console.error(err))
        .finally(() => setShifts((prev) => ({ ...prev, loading: false })));
    };

    fetchShifts();
  }, [user]);

  return (
    <Page title="All Shifts" enableHeader>
      <main className="flex flex-col pb-4 space-y-2">
        {shifts.loading ? (
          <div className="relative w-full min-h-[20vh]">
            <Loader />
          </div>
        ) : shifts.data.length ? (
          shifts.data
            .slice()
            .reverse()
            .map((shift) => (
              <AllShiftCard {...shift} data={shift} setData={setShifts} />
            ))
        ) : (
          <Empty title="No shifts found!" noMargin />
        )}
      </main>
    </Page>
  );
};

export default AllFacilityShifts;
