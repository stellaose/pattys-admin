import { store } from "#/store";
import { authApi, globalApi } from "#store/api";
import { setAllAppKeys } from "#/store/slice/app";

export const handleLogout = () => {
  store.dispatch(
    setAllAppKeys({
      request: undefined,
      response: undefined,
      url: "",
      isLoggedIn: false,
      isForgotPassword: false,
      adminId: "",
      user:undefined
    }),
  );

  store.dispatch(authApi.util.resetApiState());
  store.dispatch(globalApi.util.resetApiState());

  if (typeof window !== "undefined") {
    sessionStorage.clear();

    if (window.location.pathname === "/dashboard") {
      window.location.replace("/");
    }
  }
};
