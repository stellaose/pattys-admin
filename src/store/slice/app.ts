import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { State } from "#model/state";
import { App } from "#model/payload";

const initialState: State.App = {
  request: undefined,
  response: undefined,
  url: "",
  isLoggedIn: false,
  isForgotPassword: false,
  adminId: "",
  user: undefined,
};

const AppSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    setAppKey: (state, action: PayloadAction<App>) => {
      const key = action.payload.key;
      (state as any)[key] = action.payload.value;
    },
    setAllAppKeys: (state, action: PayloadAction<State.App>) => {
      return action.payload;
    },
  },
});

export const { setAllAppKeys, setAppKey } = AppSlice.actions;
export const appReducer = AppSlice.reducer;
