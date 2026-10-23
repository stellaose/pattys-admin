import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { App as AntApp, ConfigProvider } from "antd";
import { store, setAllAppKeys } from "#/store";
import { authApi, globalApi } from "#/store/api";
import { State } from "#/model/state";
import { getThemeConfig } from "#/config/theme";

// Matches the initial state of the app slice
export const initialAppState: State.App = {
  request: undefined,
  response: undefined,
  url: "",
  isLoggedIn: false,
  isForgotPassword: false,
  adminId: "",
  user: undefined,
};

// Puts the shared store back to a logged-out state between tests
export const resetStore = (state: Partial<State.App> = {}) => {
  store.dispatch(authApi.util.resetApiState());
  store.dispatch(globalApi.util.resetApiState());
  store.dispatch(setAllAppKeys({ ...initialAppState, ...state }));
};

// Same providers the app uses in layout.tsx: Redux plus antd App/theme,
// which useNotify needs to show notifications
const Providers = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <AntApp>
      <ConfigProvider theme={getThemeConfig()}>{children}</ConfigProvider>
    </AntApp>
  </Provider>
);

export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: Providers, ...options });

export const Wrapper = Providers;

export { store };
