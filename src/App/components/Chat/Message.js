import React from "react";

import { Avatar } from "@material-ui/core";
import { msToTime } from "../../utils/common";
import MessageContent from "./MessageContent";

function Message({ mine, messages, theme }) {
  const sender = messages.length > 0 && messages[0].sender;
  const myStyle = {
    backgroundColor: theme.myTextBgc,
    color: theme.myTextColor,
  };
  const roommateStyle = {
    backgroundColor: theme.textBgc,
    color: theme.textColor,
  };
  const inforStyle = {
    color: theme.color,
  };
  const style = mine ? myStyle : roommateStyle;
  return (
    <div className={mine ? "message-item mine" : "message-item"}>
      <div className="message-container">
        {!mine ? <Avatar src={sender.avatar}>{sender.name[0]}</Avatar> : null}
        <div className="message-item-content">
          <p className="message-info" style={{ ...inforStyle }}>{`${
            mine ? "You" : sender.name
          }, ${msToTime(messages[0].createdAt)}`}</p>
          <div className="message-content">
            {messages.map((msg, i) => (
              <MessageContent color={style} key={i} message={msg} mine={mine} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;
