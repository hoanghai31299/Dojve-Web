import React, { useState, useEffect } from "react";
import { AppBar, makeStyles, Tab, Tabs, useTheme } from "@material-ui/core";
import { Chat, Notifications } from "@material-ui/icons";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "../MaterialUi/TabPanel";
import RoomItem from "../Chat/RoomItem";
import BadgeIcon from "../MaterialUi/BadgeIcon";
import FriendRequest from "../SideBarTab/FriendRequest";
import { useParams } from "react-router";
import axios from "../../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { setRooms, roomActive, addRoom } from "../../../redux/features/rooms";
import { setRequest, newRequest } from "../../../redux/features/friendRequest";
import { message } from "antd";
function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}));

function SideBarTab({ user, setExpand }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const socket = useSelector((state) => state.socket.current);
  const rooms = useSelector((state) => state.rooms.rooms);
  const invites = useSelector((state) => state.invites.request);
  const handleChange = (event, newValue) => {
    setTab(newValue);
  };
  const handleChangeIndex = (index) => {
    setTab(index);
  };
  const { roomId } = useParams();
  useEffect(() => {
    axios.get("/user/getListFriendRequest").then((res) => {
      const { data } = res;
      if (!data.error && data.error !== undefined) {
        dispatch(setRequest(data.requests));
      }
    });
    axios.get(`/rooms`).then((res) => {
      const { data } = res;
      if (!data.error && data.error !== undefined) {
        let room = data.rooms.map((room) => {
          if (room.members.some((m) => m.status !== 0)) room.status = true;
          if (room.theme) room.theme = JSON.parse(room.theme);
          return room;
        });
        dispatch(setRooms(room));
      }
    });
  }, [dispatch, socket]);
  useEffect(() => {
    socket.on("user-online", (data) => {
      const { room, user } = data;
      dispatch(roomActive({ room, user, status: 1 }));
    });
    socket.on("user-offline", (data) => {
      const { room, user } = data;
      dispatch(roomActive({ room, user, status: 0 }));
    });
    socket.on(user._id, (data) => {
      const { action } = data;

      if (action === "RECEIVE") {
        dispatch(newRequest(data.user));
      }
      if (action === "ACCEPT_REQUEST") {
        if (data.room) {
          dispatch(addRoom(data.room));
        }
      }
      if (action === "JOIN_ROOM") {
        message.info(data.user.name + " add you to" + data?.room.name);
        dispatch(addRoom(data.room));
      }
    });
    return () => {
      socket?.off(["user-online", "user-offline", user._id]);
    };
  }, [dispatch, socket, user]);
  return (
    <div className="sidebar-tab">
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={tab}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            centered
            aria-label="full width tabs example"
          >
            <Tab
              icon={
                <BadgeIcon number={0}>
                  <Chat />
                </BadgeIcon>
              }
              {...a11yProps(0)}
            />
            <Tab
              icon={
                <BadgeIcon number={invites.length}>
                  <Notifications />
                </BadgeIcon>
              }
              {...a11yProps(1)}
            />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={tab}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={tab} index={0} dir={theme.direction}>
            {rooms && (
              <div className="sidebar-rooms hide">
                {rooms.map((room, index) => {
                  return (
                    <div key={room._id} onClick={() => setExpand(false)}>
                      <RoomItem
                        userId={user._id}
                        room={room}
                        active={room._id === roomId}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </TabPanel>
          <TabPanel value={tab} index={1} dir={theme.direction}>
            <FriendRequest socket={socket} invites={invites} />
          </TabPanel>
        </SwipeableViews>
      </div>
    </div>
  );
}

export default SideBarTab;
