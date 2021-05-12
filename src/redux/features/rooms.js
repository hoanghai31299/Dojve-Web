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
      console.log("alo");
      state.rooms.sort((a, b) => {
        const time1 = new Date(a);
        const time2 = new Date(b);
        return time1.getTime() - time2.getTime();
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRooms, roomActive, addRoom, changeTheme, sortRoom } =
  roomSlide.actions;

export default roomSlide.reducer;
