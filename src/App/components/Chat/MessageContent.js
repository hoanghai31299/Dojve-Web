import React from "react";
import Invitation from "./Invitation";
import { Image } from "antd";
import { ReactVideo } from "reactjs-media";
function MessageContent({ message, mine, color }) {
  return (
    <React.Fragment>
      {message.type === 0 ? (
        <div className="message-text">
          <p style={{ ...color }}>{message.content}</p>
        </div>
      ) : message.type === 1 ? (
        <img src={message.content} alt="sticker" />
      ) : message.type !== 4 ? (
        message.type === 5 ? (
          <Invitation
            mine={mine}
            sender={message.sender}
            sid={message.content}
          />
        ) : (
          <Image src={message.content} className="gif" alt="message-img" />
        )
      ) : (
        <div className="msg-video">
          <ReactVideo
            primaryColor="#6A2CD8"
            width={500}
            poster={
              message.content.substr(0, message.content.lastIndexOf(".")) +
              ".jpg"
            }
            src={message.content}
          />
        </div>
      )}
    </React.Fragment>
  );
}

export default MessageContent;
