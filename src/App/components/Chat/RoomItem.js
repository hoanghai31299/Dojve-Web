import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { sortRoom } from "../../../redux/features/rooms";
import { msToTime } from "../../utils/common";
import AvatarBadge from "../MaterialUi/AvatarBadge";
function RoomItem({ room, active, userId }) {
  const history = useHistory();
  const socket = useSelector((state) => state.socket.current);
  const dispatch = useDispatch();
  useEffect(() => {
    socket.emit("join", { _id: room._id });
  }, [room._id, socket]);

  let { _id, name, lastMessage, members } = room;
  let online =
    members.find((mem) => mem.status > 0 && mem._id !== userId) !== undefined;
  if (!lastMessage)
    lastMessage = {
      type: 0,
      content: "LET SAY HELLO TO EVERYONE.",
      createdAt: "",
    };
  const [last, setLast] = useState(lastMessage);
  useEffect(() => {
    socket.on("roomMessage", ({ action, message }) => {
      switch (action) {
        case "RECEIVE":
          if (message.to === _id) {
            const sender = members.find((m) => message.sender?._id === m._id);
            const before = sender._id === userId ? "You: " : `${sender.name}: `;
            setLast({ ...message, content: before + message.content });
            dispatch(
              sortRoom({
                _id,
              })
            );
          }
          break;
        default:
          break;
      }
    });
  }, [_id, socket, userId, members, dispatch]);

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
        {last && <p>{last.type !== 0 ? "Send an attachment" : last.content}</p>}
        {!last && <p>SAY HELLO TO EVERYONE</p>}
      </div>
      <div className="timmer">
        {last.createdAt && <h3>{msToTime(last.createdAt)}</h3>}
      </div>
    </div>
  );
}

export default RoomItem;
