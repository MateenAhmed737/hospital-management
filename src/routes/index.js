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
  Shift,
  Recent,
  Completed,
  Inbox,
  Chat,
} from "../pages";
import { useSelector } from "react-redux";
import { useAppState } from "../hooks";

// Router component handles the routing of the application
const Router = () => {
  const { loading } = useAppState();
  const user = useSelector((state) => state.user);

  console.log("user", user);
  const role = user?.role;

  const Dashboard = user && require("../pages/" + role + "/Dashboard").default;

  const privateRoute = (Page) => (user ? <Page /> : <AccessDenied />);
  const publicRoute = (Page) => (user ? <Navigate to="/" /> : <Page />);

  // const login = useCallback(async (email, password) => {
  //   setLoading(true);
  //   let json = null;

  //   try {
  //     let formdata = new FormData();
  //     formdata.append("email", email);
  //     formdata.append("password", password);

  //     let requestOptions = {
  //       headers: {
  //         Accept: "application/json",
  //       },
  //       method: "POST",
  //       body: formdata,
  //       redirect: "follow",
  //     };

  //     const res = await fetch(`${base_url}/user-login`, requestOptions);
  //     json = await res.json();

  //     if (json.success) {
  //       let data = json.success.data;

  //       userActions.set(data);
  //     } else {
  //       localStorage.clear();
  //       userActions.set(null);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     localStorage.clear();
  //     userActions.set(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   const user_data = JSON.parse(localStorage.getItem("user"));

  //   if (user_data) {
  //     login(user_data.email, user_data.password);
  //   } else {
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 500);
  //   }
  // }, [login]);

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
            <Route element={<Auth allowedRoles={["1", "2", "3"]} />}></Route>

            {/* For Staff (1) */}
            <Route element={<Auth allowedRoles={["1"]} />}>
              <Route path="/shifts">
                <Route index element={privateRoute(Recent)} />
                <Route
                  path="/shifts/completed"
                  element={privateRoute(Completed)}
                />
              </Route>
              <Route
                path="/upcoming-shifts"
                element={privateRoute(UpcomingShifts)}
              /> 
              <Route path="/messages">
                <Route index element={privateRoute(Inbox)} />
                <Route path="/messages/:id" element={privateRoute(Chat)} />
              </Route>
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
