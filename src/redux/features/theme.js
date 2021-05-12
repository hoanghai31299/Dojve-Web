import { createSlice } from "@reduxjs/toolkit";
import { defaultTheme } from "../../App/utils/common";
export const themeSlide = createSlice({
  name: "rooms",
  initialState: defaultTheme,
  reducers: {
    setTheme: (state, action) => {
      state.rooms = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTheme } = themeSlide.actions;

export default themeSlide.reducer;
