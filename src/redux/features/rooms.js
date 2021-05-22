import { createSlice } from "@reduxjs/toolkit";
export const roomSlide = createSlice({
  name: "rooms",
  initialState: {
    rooms: [],
  },
  reducers: {
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
    addRoom: (state, action) => {
      state.rooms = [...state.rooms, action.payload];
    },
    roomActive: (state, action) => {
      state.rooms = state.rooms.map((room) => {
        if (room._id === action.payload.room)
          room.members = room.members.map((mem) => {
            if (mem._id === action.payload.user)
              mem.status = action.payload.status;
            return mem;
          });
        return room;
      });
    },
    changeTheme: (state, action) => {
      state.rooms = state.rooms.map((room) => {
        if (room._id === action.payload.room) {
          room.theme = action.payload.theme;
        }
        return room;
      });
    },
    sortRoom: (state, action) => {
      const roomId = action.payload._id;
      const room = state.rooms.find((r) => r._id === roomId);
      const rooms = [...state.rooms];
      const filter = rooms.filter((r) => r._id !== roomId);
      state.rooms = [room, ...filter];
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRooms, roomActive, addRoom, changeTheme, sortRoom } =
  roomSlide.actions;

export default roomSlide.reducer;
