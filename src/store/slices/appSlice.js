import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    homeRoute: "/home",
    loading: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    set: (state, action) => {
      if (action.payload?.key) {
        state[action.payload.key] = action.payload.value;
        return;
      }
      return action.payload;
    },
  },
});

export const { actions: appActions } = appSlice;

export default appSlice.reducer;
