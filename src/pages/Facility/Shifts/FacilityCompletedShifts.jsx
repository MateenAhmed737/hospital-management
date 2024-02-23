import React, { useEffect, useState } from 'react'
import { Empty, Loader, Page } from '../../../components';
import { AllShiftCard } from '../../../components/Cards/Facility';
import { useSelector } from 'react-redux';
import { base_url } from '../../../utils/url';

const getShifts = `${base_url}/approved-shift/`;
const FacilityCompletedShifts = () => {
    const user = useSelector((state) => state.user);
    const [shifts, setShifts] = useState({ loading: true, data: [] });
  
    console.log(shifts)
  
    useEffect(() => {
      const fetchShifts = () => {
        setShifts({ loading: true, data: [] });
        const formdata = new FormData();
        formdata.append("type", "Facility");
  
        fetch(getShifts + user?.id, {
          method: "POST",
          body: formdata,
        })
          .then((res) => res.json())
          .then((res) => {
            console.log('res =====>', res)
            const data = res.success.data || [];
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
                <AllShiftCard {...shift} data={{...shift, profile_image: user.profile_image}} setData={setShifts} disableDetail />
              ))
          ) : (
            <Empty title="No shifts found!" noMargin />
          )}
        </main>
      </Page>
    );
}

export default FacilityCompletedShifts