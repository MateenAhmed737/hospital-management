import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    set: (state, action) => {
      return action.payload;
    },
  },
});

export const { actions: userActions } = userSlice;

export default userSlice.reducer;
