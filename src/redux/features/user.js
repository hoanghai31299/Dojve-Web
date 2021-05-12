import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    current: {},
  },
  reducers: {
    setUser: (state, action) => {
      state.current = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setToken } = userSlice.actions;

export default userSlice.reducer;
