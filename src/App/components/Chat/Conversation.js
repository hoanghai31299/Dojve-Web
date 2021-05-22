import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  CircularProgress,
  IconButton,
  LinearProgress,
} from "@material-ui/core";
import {
  Videocam,
  Call,
  MoreVert,
  Image,
  Gif as GifIcon,
  InsertDriveFile,
  Send,
} from "@material-ui/icons";
import AvatarBadge from "../MaterialUi/AvatarBadge";
import Message from "./Message";
import axios from "../../utils/axios";
import { useSelector } from "react-redux";
import Sticker from "../Sticker/Sticker";
import SimplePopover from "../MaterialUi/Popover";
import Gif from "../Sticker/Gif";
import { message, Spin, Upload } from "antd";
import Drawer from "../MaterialUi/Drawer";
import RoomSetting from "./RoomSetting";
import { defaultTheme } from "../../utils/common";
import { originURL, serverURL } from "../../../config";

function Conversation({ roomId }) {
  const [inputMessage, setInputMessage] = useState("");

  const socket = useSelector((state) => state.socket.current);
  const user = useSelector((state) => state.user.current);
  const rooms = useSelector((state) => state.rooms.rooms);
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState(undefined);
  const [roomIdC, setRoomIdC] = useState();
  const messagesEndRef = useRef(null);
  const [typing, setTyping] = useState({ status: false, sender: "", to: "" });
  const [loadingUpImage, setloadingUpImage] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);
  const [loadingCall, setLoadingCall] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(false);
  useEffect(() => {
    setRoomIdC(roomId);
  }, [roomId]);
  //open video call
  const openVideoCall = (config) => {
    setLoadingCall(true);
    axios
      .get(`/call/getToken?roomid=${roomId}`)
      .then((res) => {
        const data = res.data;
        setLoadingCall(false);
        if (!data.error && data.error !== undefined) {
          socket.emit(
            "videocall",
            {
              action: "startCall",
              aToken: data.token,
              roomId,
              sid: data.roomSID,
              video: config.video,
            },
            (error, msg) => {
              if (error) console.log(error);
              console.log(msg);
            }
          );
        }
        window.open(
          `${originURL()}/call/${roomId}?t=${data.token}&video=${config.video}`,
          "VIDEO CALL",
          "toolbar=0,status=0,width=1000,height=700"
        );
      })
      .catch((error) => {
        alert("some thing wrong");
      });
  };

  //scroll to bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, loadingMessage]);
  const socketListenerCallback = useCallback(() => {
    socket.on("messages", (data) => {
      switch (data.action) {
        case "RECEIVE_TYPING":
          setTyping({
            to: data.to,
            sender: data.sender,
            status: true,
          });
          break;
        case "RECEIVE_DONE_TYPING":
          setTyping((old) => ({
            ...old,
            status: false,
          }));
          break;
        case "RECEIVE":
          let newMessage = data.message;
          if (newMessage.sender._id + "" === user._id + "") break;
          if (roomIdC === newMessage.to + "") {
            setMessages((cur) => {
              if (
                cur[cur.length - 1] &&
                newMessage.sender._id + "" === cur[cur.length - 1].senderId + ""
              ) {
                return [
                  ...cur.slice(0, cur.length - 1),
                  {
                    ...cur[cur.length - 1],
                    messages: [...cur[cur.length - 1].messages, newMessage],
                  },
                ];
              } else {
                let newGroup = {
                  senderId: newMessage.sender._id,
                  messages: [newMessage],
                };
                return [...cur, newGroup];
              }
            });
          }
          break;
        default:
          break;
      }
    });
  }, [socket, user._id, roomIdC]);
  //socket on messages
  useEffect(() => {
    socketListenerCallback();
    return () => socket?.off("messages");
  }, [socketListenerCallback, socket]);
  const sendAMessage = (type, content, to = roomId) => {
    const sendMessage = {
      type,
      content,
      to,
      sender: {
        name: user.name,
        _id: user._id,
        email: user.email,
      },
    };
    // setMessages((old) => [...old, sendMessage]);
    const lastMessage = { ...messages[messages.length - 1] };
    if (user._id + "" === lastMessage.senderId + "") {
      setMessages((cur) => {
        console.log(cur[cur.length - 1]);
        return [
          ...cur.slice(0, cur.length - 1),
          {
            ...cur[cur.length - 1],
            messages: [...cur[cur.length - 1].messages, sendMessage],
          },
        ];
      });
    } else {
      let newGroup = {
        senderId: user._id,
        messages: [sendMessage],
      };
      setMessages([...messages, newGroup]);
    }
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
  //get messages of the room
  useEffect(() => {
    setLoadingMessage(true);
    if (roomId) {
      axios.get(`/message/getMessages/${roomId}`).then((res) => {
        const { data } = res;
        if (!data.error && data.error !== undefined) {
          setMessages(data.messages);
          setLoadingMessage(false);
        } else {
          console.log(data);
          setLoadingMessage(false);
        }
      });
      // getMessageRoom(roomId, 1, 0, setMessages);
    }
  }, [roomId, user]);
  useEffect(() => {
    const currentRoom = rooms.find((room) => room._id === roomId);
    if (currentRoom)
      setRoom({
        current: currentRoom,
        partner: currentRoom.members.filter((m) => m._id !== user._id),
      });
  }, [roomId, rooms, user]);
  const onInputChange = (e) => {
    if (inputMessage.trim().length > 0) {
      socket.emit(
        "messages",
        {
          action: "SEND_TYPING",
          to: roomId,
        },
        (r) => {
          if (r) console.log(r);
        }
      );
      if (e.key === "Enter") {
        sendAMessage(0, inputMessage, roomId, user._id);
        setInputMessage("");
        socket.emit(
          "messages",
          {
            action: "SEND_DONE_TYPING",
            to: roomId,
          },
          (r) => {
            if (r) console.log(r);
          }
        );
      }
    } else {
      socket.emit(
        "messages",
        {
          action: "SEND_DONE_TYPING",
          to: roomId,
        },
        (r) => {
          if (r) console.log(r);
        }
      );
    }
  };
  const onChangeUpload = (upload) => {
    const file = upload.file;
    if (file.status !== "done") setloadingUpImage(true);
    else {
      setloadingUpImage(false);
      if (!file.response.error) {
        const type = file.type.includes("image") ? 3 : 4;
        sendAMessage(type, file.response.image_url);
      } else message.error("Something wrong :( please retry later");
    }
  };
  const handleOnSendClick = () => {
    sendAMessage(0, inputMessage, roomId, user._id);
    setInputMessage("");
    socket.emit(
      "messages",
      {
        action: "SEND_DONE_TYPING",
        to: roomId,
      },
      (r) => {
        if (r) console.log(r);
      }
    );
  };
  if (room)
    return (
      <div className="conversation">
        <Drawer
          title={
            room.partner.length === 1 ? room.partner[0].name : room.current.name
          }
          toggleDrawer={setOpenSetting}
          drawer={openSetting}
          children={<RoomSetting room={room} />}
        />
        <div className="header">
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
          <div className="room-info">
            {room.partner.length === 1 ? (
              <>
                <h5>{room.partner[0].name}</h5>
                <p>{room.partner[0].status ? "Online" : "Offline"}</p>
              </>
            ) : (
              <>
                <h5>{room.current.name}</h5>
                <p>
                  {room.partner.find((p) => p.status > 0) !== undefined
                    ? "Online"
                    : "Offline"}
                </p>
              </>
            )}
          </div>

          <div className="room-action">
            {!loadingCall && (
              <IconButton onClick={() => openVideoCall({ video: true })}>
                <Videocam />
              </IconButton>
            )}
            {loadingCall && <Spin />}
            {!loadingCall && (
              <IconButton onClick={() => openVideoCall({ video: false })}>
                <Call />
              </IconButton>
            )}
            {loadingCall && <Spin />}
            <IconButton onClick={() => setOpenSetting(!openSetting)}>
              <MoreVert />
            </IconButton>
          </div>
        </div>
        <div
          className="body"
          style={{
            backgroundColor: room.current?.theme?.bgc || defaultTheme.bgc,
          }}
        >
          {loadingMessage ? (
            <div className="loading-messages">
              <Spin size="large" />
            </div>
          ) : (
            messages.map((msg, i) => (
              <Message
                theme={room.current?.theme || defaultTheme}
                key={i}
                messages={msg.messages}
                mine={msg.senderId === user._id}
              />
            ))
          )}

          <div ref={messagesEndRef} />
        </div>
        <div className="conversation-action">
          {typing.to === roomId && typing.status && (
            <div className="typing-msg">
              <span>{typing.sender} is typing </span>
              <div id="wave">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
          <div className="button">
            <Upload
              name="image"
              action={`${serverURL()}/message/upImage`}
              withCredentials={true}
              showUploadList={false}
              onChange={onChangeUpload}
            >
              {!loadingUpImage ? (
                <IconButton>
                  <Image />
                </IconButton>
              ) : (
                <CircularProgress style={{ width: "18px", height: "18px" }} />
              )}
            </Upload>

            <SimplePopover icon={<InsertDriveFile />}>
              <Sticker sendAMessage={sendAMessage} />
            </SimplePopover>
            <SimplePopover icon={<GifIcon />}>
              <Gif sendAMessage={sendAMessage} />
            </SimplePopover>
          </div>
          <div className="message-input">
            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={onInputChange}
              type="text"
              placeholder="Typing a message"
            />
          </div>

          <div className="send-btn">
            <IconButton onClick={handleOnSendClick}>
              <Send />
            </IconButton>
          </div>
        </div>
      </div>
    );
  else return <LinearProgress />;
}

export default Conversation;
