import React from "react";
import AvatarBadge from "../MaterialUi/AvatarBadge";
import { themes } from "../../utils/common";
import ThemeItem from "./ThemeItem";
import { useDispatch, useSelector } from "react-redux";
import { changeTheme } from "../../../redux/features/rooms";
import { message, Row } from "antd";
import axios from "../../utils/axios";
import { IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";
function RoomSetting({ room, onClose }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.current);
  const handleChangeTheme = (theme) => {
    if (theme.name !== room.current.theme?.name) {
      dispatch(changeTheme({ room: room.current?._id, theme: theme }));
      message.info(`Changed to theme ${theme.name}`);
    } else message.info(`You're in theme ${theme.name}`);
    axios.put(`/rooms/update/${room.current._id}`, {
      theme: JSON.stringify(theme),
    });
  };
  return (
    <div className="settings">
      <div className="settings-header">
        <div className="settings-avatar">
          {room.partner.length === 1 ? (
            <AvatarBadge
              src={room.partner[0].avatar}
              name={room.partner[0].name}
              status={room.partner[0].status}
            />
          ) : (
            <AvatarBadge
              src={room.current.avatar}
              name={room.current.name}
              status={room.partner.find((p) => p.status > 0) !== undefined}
            />
          )}
        </div>
        <div className="room-info">
          {room.partner.length === 1 ? (
            <div>
              <h5>{room.partner[0].name}</h5>
              <p>{room.partner[0].status ? "Online" : "Offline"}</p>
            </div>
          ) : (
            <div>
              <h5>{room.current.name}</h5>
              <p>
                {room.partner.find((p) => p.status > 0) !== undefined
                  ? "Online"
                  : "Offline"}
              </p>
            </div>
          )}
        </div>
      </div>
      <h4>Change Theme</h4>
      <div className="settings-theme">
        {themes.map((theme) => (
          <ThemeItem
            key={theme.name}
            theme={theme}
            handleChangeTheme={() => handleChangeTheme(theme)}
          />
        ))}
      </div>
      <h4>Members</h4>
      <div className="room-members">
        {room.current?.members.map((user) => {
          return (
            <Row className="member-group-list" key={user._id}>
              <AvatarBadge
                src={user.avatar}
                name={user.name}
                status={user.status}
              />
              <div>
                {user.name}
                {user._id === currentUser._id && " (You)"}
              </div>
            </Row>
          );
        })}
      </div>
      <span className="btn-close">
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </span>
    </div>
  );
}

export default RoomSetting;
