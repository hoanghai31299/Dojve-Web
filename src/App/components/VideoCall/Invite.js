import { Button, List, message, Skeleton } from "antd";
import axios from "../../utils/axios";
import React, { useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";
import { getFirstLetter } from "../../utils/common";
import { useSelector } from "react-redux";
function Invite({ sid }) {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const socket = useSelector((state) => state.socket.current);
  const user = useSelector((state) => state.user.current);
  useEffect(() => {
    setLoading(true);
    axios
      .get("/rooms")
      .then(({ data }) => {
        if (!data.error && data.error !== undefined) {
          const rooms = data.rooms;
          console.log(rooms);
          const twoMem = rooms.filter((r) => r.members.length === 2);

          const friends = twoMem.map((r) => {
            const u = r.members.find((mem) => mem._id !== user._id);
            u.roomId = r._id;
            return u;
          });
          setFriends(friends);
          setLoading(false);
        }
      })
      .catch((err) => {
        message.error("Some thing wrong!, " + err.msg);
      });
  }, [user]);
  const handleInvite = (roomId) => {
    const sendMessage = {
      type: 5,
      content: sid,
      to: roomId,
      sender: {
        name: user.name,
        _id: user._id,
        email: user.email,
      },
    };
    socket.emit(
      "messages",
      {
        action: "SEND",
        message: sendMessage,
        room: roomId,
      },
      (r) => {
        if (r) console.log(r);
      }
    );
  };
  return (
    <div className="invite-call">
      <List
        className="list-invite"
        itemLayout="horizontal"
        dataSource={friends}
        renderItem={(user) => (
          <List.Item>
            <Skeleton avatar title={false} loading={loading} active>
              <List.Item.Meta
                avatar={
                  <Avatar src={user.avatar}>{getFirstLetter(user.name)}</Avatar>
                }
                title={user.name}
                description="Invite to this video-call"
              />
              <Button onClick={() => handleInvite(user.roomId)}>Invite</Button>
            </Skeleton>
          </List.Item>
        )}
      />
      ,
    </div>
  );
}

export default Invite;
