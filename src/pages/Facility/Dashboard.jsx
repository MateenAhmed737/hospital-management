import { useCallback, useEffect, useState } from "react";
import { Loader, Page, Empty } from "../../components";
import { fetchData, formatNumbers } from "../../utils";
import { base_url } from "../../utils/url";
import { useSelector } from "react-redux";
import CompletedShiftImg from "../../assets/images/DashboardIcons/pending.png";
import MonthIncomeImg from "../../assets/images/DashboardIcons/income.png";
import UpcomingImg from "../../assets/images/DashboardIcons/upcoming.png";
import RecentImg from "../../assets/images/DashboardIcons/recent.png";
import { Link } from "react-router-dom";
import { ShiftCard } from "../../components/Cards/Facility";

const getAnalytics = `${base_url}/facility-dashboard/`;
const getShifts = `${base_url}/get-shift/`;
const Dashboard = () => {
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState({});
  const [shifts, setShifts] = useState({
    loading: true,
    data: [],
  });

  const fetchShifts = useCallback(async () => {
    setShifts((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch(getShifts + user?.id);
      const json = await res.json();

      if (json.success) {
        const data = json.success.data || [];
        setShifts((prev) => ({ ...prev, data }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setShifts((prev) => ({ ...prev, loading: false }));
    }
  }, [user]);

  useEffect(() => {
    fetchData({
      url: getAnalytics + user?.id,
      neededProps: [],
      setIsLoading,
      callback: (data) => setAnalytics(data),
    });

    fetchShifts();
  }, [user, fetchShifts]);

  return (
    <Page title="Dashboard" enableHeader headerStyles="!mb-4">
      {isLoading ? (
        <div className="relative w-full min-h-[80vh]">
          <Loader />
        </div>
      ) : (
        <main>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid grid-cols-1 gap-2">
              <Card
                title="All Posted Shifts"
                value={formatNumbers(analytics.posted_shifts_count, "decimal") + " Shifts"}
                icon={CompletedShiftImg}
                color="rgba(255, 161, 88, 0.2)"
              />
              <Card
                title="Total Confirmed Shifts"
                value={formatNumbers(analytics.confirmed_job_count, "decimal") + " Shifts"}
                icon={UpcomingImg}
                color="rgba(162, 144, 242, 0.2)"
                styles="space-y-6 sm:space-y-0"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Card
                title="Total Invoice Amount"
                value={formatNumbers(analytics.total_invoice_amount, "currency")}
                icon={MonthIncomeImg}
                color="rgba(165, 204, 142, 0.3)"
                styles="space-y-6 sm:space-y-0"
              />
              <Card
                title="Total Pending Shifts"
                value={formatNumbers(analytics.pending_shifts_count, "decimal") + " Shifts"}
                icon={RecentImg}
                color="rgba(132, 114, 212, 0.2)"
              />
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-600">
                Posted Shifts
              </h2>
              <Link
                to="/fc-shifts"
                className="text-xs text-primary-500 hover:underline"
              >
                See more
              </Link>
            </div>

            <div className="flex flex-col mt-2 space-y-2">
              {shifts.loading ? (
                <div className="relative w-full min-h-[20vh]">
                  <Loader />
                </div>
              ) : shifts.data.length ? (
                shifts.data
                  .slice(-4).reverse()
                  .map((shift) => <ShiftCard key={shift.id} {...shift} data={shift} setData={setShifts} />)
              ) : (
                <Empty title="No shifts found!" noMargin />
              )}
            </div>
          </div>
        </main>
      )}
    </Page>
  );
};

const Card = ({ title, value, color, icon, styles }) => {
  return (
    <div
      className={
        "flex flex-col items-center justify-between px-4 py-3 text-sm rounded-lg sm:flex-row " +
        styles
      }
      style={{ backgroundColor: color }}
    >
      <div className="flex flex-col items-center self-start justify-start mb-2 font-medium sm:mb-0 sm:flex-row">
        <img
          src={icon}
          alt={title + "-icon"}
          className="self-start w-8 h-8 mr-3 rounded-full"
        />
        {title}
      </div>

      <span className="self-end text-xs sm:self-auto">{value}</span>
    </div>
  );
};

export default Dashboard;
