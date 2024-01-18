import React, { useCallback, useContext, useEffect, useState } from "react";
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
} from "../pages";
// import { base_url } from "../utils/url";
import { useSelector } from "react-redux";
// import { userActions } from "../store/slices";

// Router component handles the routing of the application
const Router = () => {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  console.log("user", user);
  // const role =
  //   user?.role_id === "1"
  //     ? "Staff"
  //     : user?.role_id === "2"
  //     ? "Admin"
  //     : "Facility";

  // const { default: Dashboard } = require(`../pages/${role}/Dashboard`);
  // const { default: TasksList } = require(`../pages/${role}/TasksList`);
  // const { default: Workers } = require(`../pages/${role}/Workers`);
  // const { default: Sellers } = require(`../pages/${role}/Sellers`);
  // const { default: Tasks } = require(`../pages/${role}/Tasks`);
  // const { default: Jobs } = require(`../pages/${role}/Jobs`);

  const privateRoute = (Page) => (user ? <Page /> : <AccessDenied />);
  const publicRoute = (Page) =>
    user ? <Navigate to="/dashboard" /> : <Page />;

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
            <Route path="/edit-profile" element={privateRoute(EditProfile)} />
            <Route path="/dashboard" element={privateRoute(AccessDenied)} />
          </Route>

          <Route path="*" element={<Page404 />} />
          <Route index path="/login" element={<Login />} />
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
    (role) => user?.role?.toLowerCase() === role?.toLowerCase()
  );

  // Check if the user role is allowed and render the protected routes
  return isAllowed ? <Outlet /> : <Navigate to="/" replace />;
};

export default Router;
