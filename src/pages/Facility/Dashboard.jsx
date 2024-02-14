import React, { useCallback, useEffect, useState } from "react";
import { JobCard, Loader, Page, Empty } from "../../components";
import { fetchData } from "../../utils";
import { base_url } from "../../utils/url";
import { useSelector } from "react-redux";
import CompletedShiftImg from "../../assets/images/DashboardIcons/pending.png";
import MonthIncomeImg from "../../assets/images/DashboardIcons/income.png";
import UpcomingImg from "../../assets/images/DashboardIcons/upcoming.png";
import RecentImg from "../../assets/images/DashboardIcons/recent.png";
import { Link } from "react-router-dom";

const getAnalytics = `${base_url}/facility-dashboard/`;
const getShifts = `${base_url}/upcomming-shift/`;
const Dashboard = () => {
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState({});
  const [upcomingShifts, setUpcomingShifts] = useState({
    loading: true,
    data: [],
  });

  const fetchShifts = useCallback(async () => {
    setUpcomingShifts((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch(getShifts + user?.id);
      const json = await res.json();

      if (json.success) {
        const data = json.success.data || [];
        setUpcomingShifts((prev) => ({ ...prev, data }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpcomingShifts((prev) => ({ ...prev, loading: false }));
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

  console.log("upcomingShifts.data", upcomingShifts.data);

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
                title="Completed Shifts"
                value={analytics.completed_shifts_count + " Shifts"}
                icon={CompletedShiftImg}
                color="rgba(255, 161, 88, 0.2)"
              />
              <Card
                title="Upcoming Shifts"
                value={analytics.upcoming_shifts_count + " Shifts"}
                icon={UpcomingImg}
                color="rgba(162, 144, 242, 0.2)"
                styles="space-y-6 sm:space-y-0"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Card
                title="Month Income"
                value={"$" + Number(analytics.total_income).toFixed(2)}
                icon={MonthIncomeImg}
                color="rgba(165, 204, 142, 0.3)"
                styles="space-y-6 sm:space-y-0"
              />
              <Card
                title="Recent Shifts"
                value={analytics.recent_shifts_count + " Shifts"}
                icon={RecentImg}
                color="rgba(132, 114, 212, 0.2)"
              />
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-600">
                Upcoming Shifts
              </h2>
              <Link
                to="/upcoming-shifts"
                className="text-xs text-blue-500 hover:underline"
              >
                See more
              </Link>
            </div>

            <div className="flex flex-col mt-2 space-y-2">
              {upcomingShifts.loading ? (
                <div className="relative w-full min-h-[20vh]">
                  <Loader />
                </div>
              ) : !upcomingShifts.loading && !upcomingShifts.data.length ? (
                <Empty title="No shifts found!" />
              ) : (
                upcomingShifts.data
                  .slice(-4)
                  .map((shift) => <JobCard {...shift} data={shift} />)
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
