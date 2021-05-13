import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import Conversation from "../components/Chat/Conversation";
import SideBar from "../components/Chat/SideBar";
import { Fab, IconButton, Tooltip } from "@material-ui/core";
import { ArrowBack, Videocam } from "@material-ui/icons";
import { useSelector } from "react-redux";
import axios from "../utils/axios";
import Skeleton from "react-loading-skeleton";
import { Modal } from "antd";
import { Call, CallEnd } from "@material-ui/icons";
import Ringring from "../../assets/images/avengerreng.mp3";
import AvatarBadge from "../components/MaterialUi/AvatarBadge";
import { originURL } from "../../config";
function Chat() {
  const { roomId } = useParams();
  const [side, setSide] = useState(false);
  const user = useSelector((state) => state.user.current);
  const audioRef = useRef(undefined);
  const [calling, setCalling] = useState({
    status: false,
    id: null,
    sid: null,
    token: null,
    caller: {
      name: "",
      avatar: "",
    },
  });
  const socket = useSelector((state) => state.socket.current);
  useEffect(() => {
    if (socket)
      socket.on("videocall", (data) => {
        switch (data.action) {
          case "RECEIVE":
            console.log("co cuoc goi den!!1");
            setCalling({
              status: true,
              id: data.roomId,
              sid: data.sid,
              caller: data.caller,
              video: data.video,
            });
            break;
          default:
            break;
        }
      });
  }, [socket, user]);
  //receive video call
  const receiveVideoCall = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    axios.get(`/call/joinRoom?sid=${calling.sid}`).then((res) => {
      const { data } = res;
      setCalling({ ...calling, status: false });
      window.open(
        `${originURL()}/call/${roomId}?t=${data.token}&video=${calling.video}`,
        "VIDEO CALL",
        "toolbar=0,status=0,width=1000,height=700"
      );
    });
  };
  const cancelCall = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCalling({ ...calling, status: false });
  };

  if (!user.name || !socket) return <Skeleton width={1000} height={1000} />;
  return (
    <div className="chat-window">
      <div className="chat-window-container">
        <div
          className={!side ? "sidebar-container" : "sidebar-container expand"}
        >
          <SideBar roomId={roomId} setExpand={setSide} />
        </div>
        <div className="chat-container">
          <div className="back-to-room">
            <IconButton onClick={() => setSide(true)}>
              <ArrowBack />
            </IconButton>
          </div>
          {roomId !== "welcome" && <Conversation user={user} roomId={roomId} />}
        </div>
      </div>
      <Modal
        title={`${calling.caller.name} is calling you`}
        visible={calling.status}
        footer={null}
        centered
      >
        <div className="calling-modal">
          <AvatarBadge
            className="avatar-calling"
            name={calling.caller.name}
            src={calling.caller.avatar}
            status={false}
          />
          <div className="calling-btn">
            <Tooltip title="Cancel" aria-label="Cancel">
              <Fab onClick={cancelCall} color="inherit" className="cancel-call">
                <CallEnd />
              </Fab>
            </Tooltip>
            <Tooltip title="Accept" aria-label="Accept">
              <Fab
                onClick={receiveVideoCall}
                color="inherit"
                className="accept-call"
              >
                {calling.video ? <Videocam /> : <Call />}
              </Fab>
            </Tooltip>
          </div>
        </div>
      </Modal>
      <audio ref={audioRef} src={Ringring}></audio>
    </div>
  );
}

export default Chat;
