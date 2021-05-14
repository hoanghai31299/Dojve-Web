import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { msToTime } from "../../utils/common";
import AvatarBadge from "../MaterialUi/AvatarBadge";
function RoomItem({ room, active, userId }) {
  const history = useHistory();
  const socket = useSelector((state) => state.socket.current);
  useEffect(() => {
    socket.emit("join", { _id: room._id });
  }, [room._id, socket]);

  let { _id, name, lastMessage, members } = room;
  let online =
    members.find((mem) => mem.status > 0 && mem._id !== userId) !== undefined;
  if (!lastMessage)
    lastMessage = {
      content: "Click to start chat...",
      createdAt: "",
    };
  const [last, setLast] = useState(lastMessage);
  useEffect(() => {
    socket.on("messages", ({ action, message }) => {
      switch (action) {
        case "RECEIVE":
          if (message.to === _id) {
            console.log("message", message);
            const sender = room.members.find(
              (m) => message.sender?._id === m._id
            );
            const before = sender._id === userId ? "You: " : `${sender.name}: `;
            setLast({ ...message, content: before + message.content });
          }
          break;
        default:
          break;
      }
    });
    return () => {
      socket.off("messages");
    };
  }, [_id, socket, userId, room]);

  const other = members.filter((user) => user._id !== userId);
  const roomName = name ? name : other[0].name;
  const onClickRoom = () => {
    history.push(`/chat/${room._id}`);
  };
  return (
    <div
      onClick={onClickRoom}
      className={active ? "room-item active" : "room-item"}
    >
      {members.length === 2 ? (
        <AvatarBadge
          src={other[0].avatar}
          name={other[0].name}
          status={online}
        />
      ) : (
        <AvatarBadge src={room.avatar} name={room.name} status={online} />
      )}
      <div className="message">
        <h3>{roomName}</h3>
        <p>{last.type !== 0 ? "Send an attachment" : last.content}</p>
      </div>
      <div className="timmer">
        <h3>{msToTime(last.createdAt)}</h3>
        <div className="new-message"></div>
      </div>
    </div>
  );
}

export default RoomItem;
