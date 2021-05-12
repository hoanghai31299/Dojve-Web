import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import socketReducer from "./features/socketClient";
import userReducer from "./features/user";
import roomReducer from "./features/rooms";
import invitesReducer from "./features/friendRequest";
import themeReducer from "./features/theme";
export default configureStore({
  reducer: {
    user: userReducer,
    socket: socketReducer,
    rooms: roomReducer,
    invites: invitesReducer,
    theme: themeReducer,
  },
  middleware: () =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
