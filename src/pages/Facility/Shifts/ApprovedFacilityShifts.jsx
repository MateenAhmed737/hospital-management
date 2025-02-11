import { useEffect, useState } from "react";
import { Empty, Loader, Page } from "../../../components";
import { AllShiftCard } from "../../../components/Cards/Facility";
import { base_url } from "../../../utils/url";
import { useSelector } from "react-redux";
import { convertTime, formatNumbers } from "../../../utils";

const getShifts = `${base_url}/facility_incompleted_shifts/`;

const ApprovedFacilityShifts = () => {
  const user = useSelector((state) => state.user);
  const [shifts, setShifts] = useState({ loading: true, data: [] });

  // console.log(shifts);

  useEffect(() => {
    const fetchShifts = () => {
      setShifts({ loading: true, data: [] });

      fetch(getShifts + user?.id)
        .then((res) => res.json())
        .then((res) => {
          // console.log("res", res);
          const data = res.success.data || [];
          setShifts({ loading: false, data });
        })
        .catch((err) => console.error(err))
        .finally(() => setShifts((prev) => ({ ...prev, loading: false })));
    };

    fetchShifts();
  }, [user]);

  return (
    <Page title="Approved Shifts" enableHeader>
      <main className="flex flex-col pb-4 space-y-2">
        {shifts.loading ? (
          <div className="relative w-full min-h-[20vh]">
            <Loader />
          </div>
        ) : shifts.data.length ? (
          shifts.data.slice().map((item) => (
            <div
              key={item.id}
              className="p-2 py-1.5 bg-gray-100 border rounded-md"
            >
              <div className="flex items-center justify-between p-1">
                <div className="flex items-center">
                  <img
                    src={item?.facility?.profile_image}
                    className="rounded-md w-11 h-11"
                    alt="facility profile"
                  />

                  <p className="flex flex-col items-start ml-2">
                    <span className="text-sm font-semibold">
                      {item.shift.title}
                    </span>
                    <span className="text-xs text-gray-600">
                      Accepted: {item.user.first_name} {item.user.last_name}
                    </span>
                  </p>
                </div>
              </div>
              <div className="w-full h-px my-1 bg-gray-300" />
              <div className="text-gray-600">
                <p className="mb-2 text-xs font-medium text-gray-800">
                  {item.shift.description}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs">
                    Shift Date: {item?.shift?.opening_date}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">
                    Shift Timing: {convertTime(item?.shift?.start_time)} -{" "}
                    {convertTime(item?.shift?.end_time)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <Empty title="No shifts found!" noMargin />
        )}
      </main>
    </Page>
  );
};

export default ApprovedFacilityShifts;
