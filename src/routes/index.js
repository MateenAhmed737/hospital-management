import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Layout, MainLoader } from "../components";
import {
  Page404,
  Login,
  EditProfile,
  ChangePassword,
  ForgotPassword,
  EmailVerification,
  AccessDenied,
  Register,
  UpcomingShifts,
  Recent,
  Completed,
  AllOffers,
  FavJobs,
  RecentJobs,
  Invoices,
} from "../pages";
import { useSelector } from "react-redux";
import { useAppState } from "../hooks";
import {
  FacilityCompletedShifts,
  OnGoingFacilityShifts,
  AllFacilityShifts,
  CheckInOuts,
} from "../pages/Facility";
import {
  ManageAdmins
} from "../pages/Admin";
import ManageStaff from "../pages/Admin/ManageStaff";

// Router component handles the routing of the application
const Router = () => {
  const { loading } = useAppState();
  const user = useSelector((state) => state.user);

  console.log("user", user);
  const role = user?.role;

  const Dashboard = user && require("../pages/" + role + "/Dashboard").default;
  const Inbox =
    user &&
    (user?.isStaff || user?.isFacility) &&
    require("../pages/" + role + "/Inbox/Inbox").default;
  const Chat =
    user &&
    (user?.isStaff || user?.isFacility) &&
    require("../pages/" + role + "/Inbox/Chat").default;

  const privateRoute = (Page) => (user ? <Page /> : <AccessDenied />);
  const publicRoute = (Page) => (user ? <Navigate to="/" /> : <Page />);

  return (
    <>
      <MainLoader
        extraStyles={loading ? "" : "!opacity-0 !pointer-events-none"}
      />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={user ? <Layout /> : <Navigate to="/login" replace />}
          >
            <Route path="/dashboard" element={privateRoute(Dashboard)} />
            <Route path="/edit-profile" element={privateRoute(EditProfile)} />

            {/* For Staff (1), Admins (2) and Facalities (3) */}
            <Route element={<Auth allowedRoles={["1", "3"]} />}>
              <Route path="/messages">
                <Route index element={privateRoute(Inbox)} />
                <Route path="/messages/:id" element={privateRoute(Chat)} />
              </Route>
            </Route>

            {/* For Staff (1), Admins (2) and Facalities (3) */}
            <Route element={<Auth allowedRoles={["2", "3"]} />}>
              <Route path="/invoices" element={privateRoute(Invoices)} />
            </Route>

            {/* For Staff (1) */}
            <Route element={<Auth allowedRoles={["1"]} />}>
              <Route path="/shifts">
                <Route index element={privateRoute(Recent)} />
                <Route
                  path="/shifts/completed"
                  element={privateRoute(Completed)}
                />
                <Route path="/shifts/all" element={privateRoute(AllOffers)} />
              </Route>
              <Route
                path="/upcoming-shifts"
                element={privateRoute(UpcomingShifts)}
              />
              <Route path="/recent-jobs" element={privateRoute(RecentJobs)} />
              <Route path="/favourite-jobs" element={privateRoute(FavJobs)} />
              <Route path="/messages">
                <Route index element={privateRoute(Inbox)} />
                <Route path="/messages/:id" element={privateRoute(Chat)} />
              </Route>
            </Route>

            {/* For Admins (2) */}
            <Route element={<Auth allowedRoles={["2"]} />}>
              <Route
                path="/manage-admin"
                element={privateRoute(ManageAdmins)}
              />
              <Route path="/manage-staff" element={privateRoute(ManageStaff)} />
              {/* <Route path="/manage-facility" element={privateRoute(ManageFacility)} /> */}
              {/* <Route path="/service-types" element={privateRoute(ManageServiceTypes)} /> */}
              <Route path="/invoices" element={privateRoute(Invoices)} />
            </Route>

            {/* For Facility (3) */}
            <Route element={<Auth allowedRoles={["3"]} />}>
              <Route path="/fc-shifts">
                <Route index element={privateRoute(AllFacilityShifts)} />
                <Route
                  path="/fc-shifts/completed"
                  element={privateRoute(FacilityCompletedShifts)}
                />
                <Route
                  path="/fc-shifts/on-going"
                  element={privateRoute(OnGoingFacilityShifts)}
                />
              </Route>
              <Route
                path="/upcoming-shifts"
                element={privateRoute(UpcomingShifts)}
              />
              <Route
                path="/check_in_outs"
                element={privateRoute(CheckInOuts)}
              />
              <Route path="/recent-jobs" element={privateRoute(RecentJobs)} />
              <Route path="/favourite-jobs" element={privateRoute(FavJobs)} />
            </Route>
          </Route>

          <Route path="*" element={<Page404 />} />
          <Route path="/login" element={<Login />} />
          <Route index path="/register" element={<Register />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route
            path="/forgot-password"
            element={publicRoute(ForgotPassword)}
          />
          <Route
            path="/email-verification"
            element={publicRoute(EmailVerification)}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

// Auth component checks if the user has the allowed role and renders the protected routes
const Auth = ({ allowedRoles }) => {
  const user = useSelector((state) => state.user);
  const isAllowed = allowedRoles.find(
    (role) => user?.role_id?.toLowerCase() === role?.toLowerCase()
  );

  // Check if the user role is allowed and render the protected routes
  return isAllowed ? <Outlet /> : <Navigate to="/" replace />;
};

export default Router;
