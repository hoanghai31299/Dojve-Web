import { Avatar, IconButton } from "@material-ui/core";
import React from "react";
import { getFirstLetter } from "../../utils/common";
import { Check, Clear } from "@material-ui/icons";
function RequestItem({ user, acceptRequest, declineRequest }) {
  return (
    <div className="request-item">
      <Avatar src={user.avatar}>{getFirstLetter(user.name)}</Avatar>
      <h3>{user.name}</h3>
      <div className="rq-btn">
        <IconButton
          onClick={() => acceptRequest(user._id)}
          variant="contained"
          color="secondary"
        >
          <Check />
        </IconButton>
        <IconButton
          onClick={declineRequest}
          variant="contained"
          color="primary"
        >
          <Clear />
        </IconButton>
      </div>
    </div>
  );
}

export default RequestItem;
