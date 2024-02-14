import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  otpData: null,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    set: (state, action) => {
      return action.payload;
    },
  },
});

export const { actions: appActions } = appSlice;

export default appSlice.reducer;
