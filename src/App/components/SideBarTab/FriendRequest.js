import { LinearProgress } from "@material-ui/core";
import React from "react";
import RequestItem from "./RequestItem";
import { deleteRequest } from "../../../redux/features/friendRequest";
import { addRoom } from "../../../redux/features/rooms";
import { useDispatch } from "react-redux";
import axios from "../../utils/axios";
import { message } from "antd";
function FriendRequest({ invites, socket }) {
  const dispatch = useDispatch();
  const acceptRequest = (_id) => {
    dispatch(deleteRequest(_id));
    message.info("You're friend now, click to chat!");
    socket.emit(
      "friends",
      {
        action: "ACCEPT",
        to: _id,
      },
      (err, room) => {
        if (err) console.log(err);
        else dispatch(addRoom(room));
      }
    );
  };
  const decline = (_id) => {
    axios.get(`user/declineRequest/${_id}`).then(({ data }) => {
      if (!data.error && data.error !== undefined) {
        dispatch(deleteRequest(_id));
        message.info("Deleted");
      }
    });
  };
  if (invites)
    return (
      <div className="friend-request">
        {invites.map((ivt) => (
          <RequestItem
            key={ivt._id}
            user={ivt}
            acceptRequest={acceptRequest}
            declineRequest={() => decline(ivt._id)}
          />
        ))}
      </div>
    );
  else return <LinearProgress />;
}

export default FriendRequest;
