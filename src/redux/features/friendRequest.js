import { createSlice } from "@reduxjs/toolkit";
export const inviteSlide = createSlice({
  name: "request",
  initialState: {
    request: [],
  },
  reducers: {
    setRequest: (state, action) => {
      state.request = action.payload;
    },
    newRequest: (state, action) => {
      state.request = [...state.request, action.payload];
    },
    deleteRequest: (state, action) => {
      state.request = state.request.filter((r) => r._id !== action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRequest, newRequest, deleteRequest } = inviteSlide.actions;

export default inviteSlide.reducer;
