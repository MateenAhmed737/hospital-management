import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Loader, Page, Empty } from "../../components";
import { fetchData } from "../../utils";
import { base_url } from "../../utils/url";
import { useSelector } from "react-redux";
import CompletedShiftImg from "../../assets/images/DashboardIcons/pending.png";
import MonthIncomeImg from "../../assets/images/DashboardIcons/income.png";
import UpcomingImg from "../../assets/images/DashboardIcons/upcoming.png";
import RecentImg from "../../assets/images/DashboardIcons/recent.png";
import * as echarts from "echarts";
import moment from "moment";

const getAnalytics = `${base_url}/admin-dashboard/`;
const getGraphData = `${base_url}/get-dashboard-graph`;

const Dashboard = () => {
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState({});
  const [date, setDate] = useState(false);
  const [graph, setGraph] = useState({
    loading: true,
    data: [],
  });

  const fetchGrapData = useCallback(async () => {
    setGraph((prev) => ({ ...prev, loading: true }));
    try {
      const formdata = new FormData();
      formdata.append("date", moment(date).format("YYYY-MM-DD"));
      const res = await fetch(getGraphData, { method: "POST", body: date ? formdata : undefined });
      const json = await res.json();

      if (json.success) {
        const data = json.success.data || [];
        console.log("data", data);
        setGraph((prev) => ({ ...prev, data }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGraph((prev) => ({ ...prev, loading: false }));
    }
  }, [date]);

  useEffect(() => {
    const formdata = new FormData();
    formdata.append("date", moment(date).format("YYYY-MM-DD"));

    const requestOptions = {
      method: "POST",
      headers: { accept: "application/json" },
      body: date ? formdata : undefined,
    };
    fetchData({
      url: getAnalytics + user?.id,
      neededProps: [],
      requestOptions,
      setIsLoading,
      callback: (data) => setAnalytics(data),
    });

    fetchGrapData();
  }, [user, fetchGrapData, date]);

  const amountOptions = useMemo(
    () => ({
      // color: ["#DE4347", "#F7D8DA", "#61a0a8"],
      tooltip: {
        trigger: "item",
        valueFormatter: (value) => "$" + Number(value).toFixed(2),
      },
      series: [
        {
          name: "Amount",
          type: "pie",
          radius: [0, 90],
          data: graph.data.length
            ? graph.data.map((item) =>
                item.name[0] !== " "
                  ? {
                      name: item.name,
                      value: item.population,
                    }
                  : null
              )
            : [],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          label: {
            alignTo: "edge",
            minMargin: 20,
            edgeDistance: 20,
            lineHeight: 15,
          },
        },
      ],
    }),
    [graph.data]
  );
  const countOptions = useMemo(
    () => ({
      // color: ["#DE4347", "#F7D8DA", "#61a0a8"],
      tooltip: {
        trigger: "item",
        valueFormatter: (value) => value,
      },
      series: [
        {
          name: "",
          type: "pie",
          radius: [0, 90],
          data: graph.data.length
            ? graph.data.map((item) =>
                item.name[0] === " "
                  ? {
                      name: item.name,
                      value: item.population,
                    }
                  : null
              )
            : [],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          label: {
            alignTo: "edge",
            minMargin: 20,
            edgeDistance: 20,
            lineHeight: 15,
          },
        },
      ],
    }),
    [graph.data]
  );

  useEffect(() => {
    if (graph.loading) return;
    setTimeout(() => {
      const countChartDom = document.getElementById("countPieChart");
      echarts
        .init(countChartDom, null, {
          renderer: "svg",
        })
        .setOption(countOptions);
      setIsLoading(false);
    }, 1000);
  }, [countOptions, graph.loading]);

  useEffect(() => {
    if (graph.loading) return;
    setTimeout(() => {
      const amountChartDom = document.getElementById("amountPieChart");
      echarts
        .init(amountChartDom, null, {
          renderer: "svg",
        })
        .setOption(amountOptions);
      setIsLoading(false);
    }, 1000);
  }, [amountOptions, graph.loading]);

  return (
    <Page title="Dashboard" enableHeader headerStyles="!mb-4">
      {isLoading ? (
        <div className="relative w-full min-h-[80vh]">
          <Loader />
        </div>
      ) : (
        <main>
          <div className="flex justify-center w-full my-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs outline-none rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full max-w-sm p-2.5"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid grid-cols-1 gap-2">
              <Card
                title="Total Facility"
                value={analytics.total_facilities}
                icon={CompletedShiftImg}
                color="rgba(255, 161, 88, 0.2)"
              />
              <Card
                title="Amount to be Paid"
                value={"$" + Number(analytics.total_unpaid || 0).toFixed(2)}
                icon={UpcomingImg}
                color="rgba(162, 144, 242, 0.2)"
                styles="space-y-6 sm:space-y-0"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Card
                title="Amount Paid"
                value={
                  "$" + Number(analytics.total_income_paid || 0).toFixed(2)
                }
                icon={MonthIncomeImg}
                color="rgba(165, 204, 142, 0.3)"
                styles="space-y-6 sm:space-y-0"
              />
              <Card
                title="Total Staff"
                value={analytics.total_staff}
                icon={RecentImg}
                color="rgba(132, 114, 212, 0.2)"
              />
            </div>
          </div>

          <div className="mt-8">
            <div className="flex flex-col mt-2 space-y-2">
              {graph.loading ? (
                <div className="relative w-full min-h-[20vh]">
                  <Loader />
                </div>
              ) : graph.data.length ? (
                <div className="flex flex-col md:flex-row">
                  <div
                    id="amountPieChart"
                    className="w-full h-[250px] mx-auto sm:max-w-md"
                  ></div>
                  <div
                    id="countPieChart"
                    className="w-full h-[250px] mx-auto sm:max-w-md"
                  ></div>
                </div>
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
