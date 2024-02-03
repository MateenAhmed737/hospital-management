import { useSelector } from "react-redux";

const useAppState = () => {
  const appState = useSelector((state) => state.app);
  const homeRoute = appState?.homeRoute || "/home";

  return { homeRoute, ...appState };
};

export default useAppState;
