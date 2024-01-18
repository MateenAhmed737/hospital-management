import React from "react";
import { GiSandsOfTime } from "react-icons/gi";
import { FaCheck, FaClipboardList, FaFileInvoiceDollar } from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { IoIosNotifications, IoMdBriefcase } from "react-icons/io";
import { FaPersonDigging } from "react-icons/fa6";
import { BsFillPersonFill, BsPersonBadgeFill } from "react-icons/bs";
import {
  MdCoPresent,
  MdOutlinePlaylistAddCheck,
  MdSubscriptions,
} from "react-icons/md";
import { AiFillDollarCircle } from "react-icons/ai";
import { RxLapTimer } from "react-icons/rx";

// NavLinks
export const navLinks = {
  Admin: [
    {
      icon: <GoHomeFill className="-ml-0.5 text-xl" />,
      id: 1,
      path: "/dashboard",
      title: "dashboard",
    },
    {
      icon: <AiFillDollarCircle className="-ml-0.5 text-xl" />,
      id: 2,
      title: "Invoices",
      path: "/invoices",
    },
    {
      icon: <MdCoPresent className="text-xl" />,
      id: 3,
      path: "/project-managers",
      title: "project_managers",
    },
    {
      icon: <BsFillPersonFill className="-ml-0.5 text-xl" />,
      id: 4,
      path: "/sellers",
      title: "sellers",
    },
    {
      icon: <FaPersonDigging className="text-xl" />,
      id: 5,
      path: "/workers",
      title: "workers",
    },
    {
      icon: <IoMdBriefcase className="text-xl" />,
      id: 6,
      path: "/jobs",
      title: "jobs",
    },
    {
      icon: <FaClipboardList className="text-xl" />,
      id: 7,
      path: "/tasks-list",
      title: "tasks_list",
    },
    {
      icon: <MdSubscriptions className="text-xl" />,
      id: 7,
      path: "/billing-and-transactions",
      title: "billing_and_transactions",
    },
  ],
  Facility: [
    {
      icon: <GoHomeFill className="-ml-0.5 text-xl" />,
      id: 1,
      path: "/dashboard",
      title: "dashboard",
    },
    {
      icon: <BsFillPersonFill className="-ml-0.5 text-xl" />,
      id: 2,
      path: "/sellers",
      title: "sellers",
    },
    {
      icon: <FaPersonDigging className="text-xl" />,
      id: 3,
      path: "/workers",
      title: "workers",
    },
    {
      icon: <IoMdBriefcase className="text-xl" />,
      id: 4,
      path: "/jobs",
      title: "jobs",
    },
    {
      icon: <FaClipboardList className="text-xl" />,
      id: 5,
      path: "/tasks-list",
      title: "tasks_list",
    },
  ],
  Staff: [
    {
      icon: <GoHomeFill className="-ml-0.5 text-xl" />,
      id: 1,
      path: "/dashboard",
      title: "dashboard",
    },
    {
      icon: <BsFillPersonFill className="-ml-0.5 text-xl" />,
      id: 2,
      path: "/sellers",
      title: "sellers",
    },
    {
      icon: <FaPersonDigging className="text-xl" />,
      id: 3,
      path: "/workers",
      title: "workers",
    },
    {
      icon: <IoMdBriefcase className="text-xl" />,
      id: 4,
      path: "/jobs",
      title: "jobs",
    },
    {
      icon: <FaClipboardList className="text-xl" />,
      id: 5,
      path: "/tasks-list",
      title: "tasks_list",
    },
  ],
};

// Dashboard Analytics
export const dashboardCards = {
  company: [
    {
      title: "Total_Lead",
      icon: <IoMdBriefcase className="text-lg text-blue-500" />,
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      title: "Total_Task",
      icon: <FaClipboardList className="text-lg text-blue-500" />,
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      title: "Total_Invoice",
      icon: <FaFileInvoiceDollar className="text-lg text-blue-500" />,
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      title: "Total_Invoice_Paid",
      icon: (
        <div className="relative">
          <FaFileInvoiceDollar className="text-lg text-blue-500" />
          <FaCheck className="absolute text-xs p-0.5 text-blue-500 bg-white rounded-full -bottom-1 -right-1" />
        </div>
      ),
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      title: "Total_Invoice_Pending",
      icon: (
        <div className="relative">
          <FaFileInvoiceDollar className="text-lg text-blue-500" />
          <GiSandsOfTime className="absolute text-sm p-0.5 text-blue-500 bg-white rounded-full -bottom-1.5 -right-1" />
        </div>
      ),
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      title: "Total_Sales",
      icon: <BsPersonBadgeFill className="text-lg text-blue-500" />,
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      title: "Total_Workers",
      icon: <FaPersonDigging className="text-lg text-blue-500" />,
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      title: "Total_Project_Manager",
      icon: <MdCoPresent className="text-lg text-blue-500" />,
      colSpan: "col-span-2 sm:col-span-1",
    },
  ],
  project_manager: [
    {
      title: "Total_Lead",
      icon: <IoMdBriefcase className="text-lg text-blue-500" />,
      colSpan: "col-span-2",
    },
    {
      title: "Total_Task",
      icon: <FaClipboardList className="text-lg text-blue-500" />,
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      title: "Total_Task_Inprogress",
      icon: <RxLapTimer className="text-lg text-blue-500" />,
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      title: "Total_Task_Pending",
      icon: <GiSandsOfTime className="text-lg text-blue-500" />,
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      title: "Total_Task_completed",
      icon: <MdOutlinePlaylistAddCheck className="text-xl text-blue-500" />,
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      title: "Total_Sales",
      icon: <BsPersonBadgeFill className="text-lg text-blue-500" />,
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      title: "Total_Workers",
      icon: <FaPersonDigging className="text-lg text-blue-500" />,
      colSpan: "col-span-2 sm:col-span-1",
    },
  ],
};

// Notification Icons
export const notificationIcons = {
  default: <IoIosNotifications className="text-lg" />,
};

export const colors = {
  error: "border-red-600 bg-red-100 text-red-600",
  info: "border-blue-600 bg-blue-100 text-blue-600",
  warning: "border-yellow-600 bg-yellow-100 text-yellow-600",
  success: "border-green-600 bg-green-100 text-green-600",
};

export const paginationEntries = ["All", 50, 100, 200, 500, 1000];
