import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import "@ant-design/v5-patch-for-react-19";
import { Provider } from "react-redux";
import { store } from "@store/index.ts";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
