import { useEffect, useState } from 'react'
import { Empty, Loader, Page } from '../../../components';
import { AllShiftCard } from '../../../components/Cards/Facility';
import { useSelector } from 'react-redux';
import { base_url } from '../../../utils/url';
import { convertTime } from '../../../utils';

const getShifts = `${base_url}/facility-ongoing-shifts/`;
const FacilityCompletedShifts = () => {
    const user = useSelector((state) => state.user);
    const [shifts, setShifts] = useState({ loading: true, data: [] });
  
    console.log(shifts)
  
    useEffect(() => {
      const fetchShifts = () => {
        setShifts({ loading: true, data: [] });
  
        fetch(getShifts + user?.id)
          .then((res) => res.json())
          .then((res) => {
            console.log('res =====>', res)
            const data = res.success?.data?.completed_shifts || [];
            setShifts({ loading: false, data });
          })
          .catch((err) => console.error(err))
          .finally(() => setShifts((prev) => ({ ...prev, loading: false })));
      };
  
      fetchShifts();
    }, [user]);
  
    return (
      <Page title="Completed Shifts" enableHeader>
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
                <div
                  key={shift.id}
                  className="p-2 py-1.5 bg-gray-100 border rounded-md"
                >
                  <div className="flex items-center justify-between p-1">
                    <div className="flex items-center">
                      <img
                        src={user.profile_image}
                        className="rounded-md w-11 h-11"
                        alt="facility profile"
                      />

                      <p className="flex flex-col items-start ml-2">
                        <span className="text-sm font-semibold">
                          {shift.title}
                        </span>
                        <span className="text-[11px] text-gray-600">
                          {user.facility_name}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-px my-1 bg-gray-300" />
                  <div className="">
                    <span className="text-xs">{shift.description}</span>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs">
                        Shift Date: {shift.opening_date}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">
                        Shift Timing: {convertTime(shift.start_time)} -{" "}
                        {convertTime(shift.end_time)}
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
}

export default FacilityCompletedShifts