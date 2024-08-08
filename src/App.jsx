import { useEffect } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { MyDesignSystem } from "./constants/designSystem";
import { PrimeReactProvider } from "primereact/api";
import { store, persistor } from "./store";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { configAxios } from "./lib/utils";
import Router from "./routes";

function App() {
  useEffect(() => {
    configAxios();
  }, [])
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PrimeReactProvider value={{ unstyled: true, pt: MyDesignSystem }}>
          <Router />
        </PrimeReactProvider>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Define default options
            className: "",
            duration: 5000,
            style: {
              background: "#363636",
              color: "#fff",
            },

            // Default options for specific types
            success: {
              duration: 3000,
              theme: {
                primary: "green",
                secondary: "black",
              },
            },
          }}
        />
      </PersistGate>
    </Provider>
  );
}

export default App;
