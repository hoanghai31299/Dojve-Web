import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";
export const socketSlice = createSlice({
  name: "socket",
  initialState: {},
  reducers: {
    connectSocket: (state, action) => {
      state.current = io.connect(`http://localhost:5000`, {
        query: {
          token: action.payload,
        },
      });
    },
    disconnect: (state) => {
      state.current.emmit("forceDisconnect");
    },
  },
});

// Action creators are generated for each case reducer function
export const { connectSocket, disconnect } = socketSlice.actions;

export default socketSlice.reducer;
