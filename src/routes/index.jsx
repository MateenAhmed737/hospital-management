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
  ChangePassword,
  ForgotPassword,
  EmailVerification,
  AccessDenied,
  Register,
  Completed,
  FavJobs,
  AwardedJobs,
  AllJobs,
  Invoices,
  Applied,
  TermsAndConditions,
  PrivacyPolicy,
} from "../pages";
import { useSelector } from "react-redux";
import { useAppState } from "../hooks";
import {
  FacilityCompletedShifts,
  OnGoingFacilityShifts,
  AllFacilityShifts,
  CheckInOuts,
  NewShift,
  Dashboard as FacilityDashboard,
  EditProfile as FacilityEditProfile,
  Inbox as FacilityInbox,
  Chat as FacilityChat,
} from "../pages/Facility";
import {
  ManageAdmins,
  ManageFacility,
  ServiceTypes,
  ManageStaff,
  Roles,
  Dashboard as AdminDashboard,
  EditProfile as AdminEditProfile,
} from "../pages/Admin";
import {
  Dashboard as StaffDashboard,
  EditProfile as StaffEditProfile,
  Inbox as StaffInbox,
  Chat as StaffChat,
} from "../pages/Staff";

const Router = () => {
  const { loading } = useAppState();
  const user = useSelector((state) => state.user);

  const { isAdmin, isStaff, isFacility } = user || {};
  const privateRoute = (Page) => (user && Page ? <Page /> : <AccessDenied />);
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
            <Route
              path="/dashboard"
              element={privateRoute(
                isAdmin
                  ? AdminDashboard
                  : isFacility
                  ? FacilityDashboard
                  : isStaff
                  ? StaffDashboard
                  : undefined
              )}
            />
            <Route
              path="/edit-profile"
              element={privateRoute(
                isAdmin
                  ? AdminEditProfile
                  : isFacility
                  ? FacilityEditProfile
                  : isStaff
                  ? StaffEditProfile
                  : undefined
              )}
            />
            <Route
              path="/terms-and-conditions"
              element={privateRoute(TermsAndConditions)}
            />
            <Route
              path="/privacy-policy"
              element={privateRoute(PrivacyPolicy)}
            />

            {/* For Staff (1), Admins (2) and Facalities (3) */}
            <Route element={<Auth allowedRoles={["1", "3"]} />}>
              <Route path="/messages">
                <Route
                  index
                  element={privateRoute(
                    isFacility
                      ? FacilityInbox
                      : isStaff
                      ? StaffInbox
                      : undefined
                  )}
                />
                <Route
                  path="/messages/:id"
                  element={privateRoute(
                    isFacility ? FacilityChat : isStaff ? StaffChat : undefined
                  )}
                />
              </Route>
            </Route>

            {/* For Staff (1), Admins (2) and Facalities (3) */}
            <Route element={<Auth allowedRoles={["2", "3"]} />}>
              <Route path="/invoices" element={privateRoute(Invoices)} />
            </Route>

            {/* For Staff (1) */}
            <Route element={<Auth allowedRoles={["1"]} />}>
              <Route path="/shifts">
                <Route index element={privateRoute(Applied)} />
                <Route
                  path="/shifts/completed"
                  element={privateRoute(Completed)}
                />
              </Route>
              <Route path="/all-jobs" element={privateRoute(AllJobs)} />
              <Route path="/awarded-jobs" element={privateRoute(AwardedJobs)} />
              <Route path="/favourite-jobs" element={privateRoute(FavJobs)} />
              <Route path="/messages">
                <Route
                  index
                  element={privateRoute(
                    isFacility
                      ? FacilityInbox
                      : isStaff
                      ? StaffInbox
                      : undefined
                  )}
                />
                <Route
                  path="/messages/:id"
                  element={privateRoute(
                    isFacility ? FacilityChat : isStaff ? StaffChat : undefined
                  )}
                />
              </Route>
            </Route>

            {/* For Admins (2) */}
            <Route element={<Auth allowedRoles={["2"]} />}>
              <Route
                path="/manage-admin"
                element={privateRoute(ManageAdmins)}
              />
              <Route path="/manage-staff" element={privateRoute(ManageStaff)} />
              <Route
                path="/manage-facility"
                element={privateRoute(ManageFacility)}
              />
              <Route
                path="/service-types"
                element={privateRoute(ServiceTypes)}
              />
              <Route path="/invoices" element={privateRoute(Invoices)} />
              <Route path="/manage-roles" element={privateRoute(Roles)} />
            </Route>

            {/* For Facility (3) */}
            <Route element={<Auth allowedRoles={["3"]} />}>
              <Route path="/fc-shifts">
                <Route index element={privateRoute(AllFacilityShifts)} />
                <Route path="/fc-shifts/new" element={privateRoute(NewShift)} />
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
                path="/check_in_outs"
                element={privateRoute(CheckInOuts)}
              />
              {/* <Route path="/recent-jobs" element={privateRoute(RecentJobs)} /> */}
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
    (role) => String(user?.role_id)?.toLowerCase() === role?.toLowerCase()
  );

  // Check if the user role is allowed and render the protected routes
  return isAllowed ? <Outlet /> : <Navigate to="/" replace />;
};

export default Router;
