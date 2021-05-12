import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import Webcam from "react-webcam";
import {
  connect,
  createLocalAudioTrack,
  createLocalVideoTrack,
  LocalVideoTrack,
} from "twilio-video";
import Participant from "./Participant";
import { Fab, Grid, IconButton, Tooltip } from "@material-ui/core";
import {
  PanoramaWideAngle,
  AppsOutlined,
  ScreenShare,
  PanoramaHorizontal,
  VideocamOutlined,
  CallEnd,
  StopScreenShare,
  Mic,
  MicOff,
  VideocamOffOutlined,
  ViewCarousel,
  PersonAdd,
} from "@material-ui/icons";
import Logo from "../../../assets/images/dojve.svg";
// import VideoTrack from "./VideoTrack";

import Slider from "react-slick";
import { message, Popconfirm } from "antd";
import Popover from "../MaterialUi/Popover";
import Invite from "./Invite";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};
function Call() {
  const { roomId } = useParams();
  const query = useQuery();
  const token = query.get("t");
  const cameraInit = query.get("video");
  const [participants, setParticipants] = useState([]);
  const [room, setRoom] = useState(null);
  const [expand, setExpand] = useState(false);
  const [mic, setMic] = useState(null);
  const [camera, setCamera] = useState(null);
  const [share, setShare] = useState(null);
  const [gridView, setGridView] = useState(false);
  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ));
  const gridRemoteParticipants = participants.map((participant) => (
    <Grid item xs key={participant.sid}>
      <Participant participant={participant} />
    </Grid>
  ));

  useEffect(() => {
    const participantConnected = (participant) => {
      message.info(participant.identity + " is in the room");
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };
    const participantDisconnected = (participant) => {
      try {
        console.log("off");
        // participant.off();
        console.log(participant);
        message.info(participant.identity + " has been disconnect!");
        setParticipants((prevParticipants) =>
          prevParticipants.filter((p) => p.sid !== participant.sid)
        );
      } catch (error) {
        console.log(error);
      }
    };

    try {
      connect(token, {
        name: roomId,
        audio: true,
        video: !!cameraInit,
      }).then(
        (room) => {
          setRoom(room);
          console.log(`Successfully joined a Room: ${room}`);
          room.on("participantConnected", participantConnected);
          room.on("participantDisconnected", participantDisconnected);
          room.participants.forEach(participantConnected);
          room.localParticipant.tracks.forEach((track) => {
            if (track.kind === "video") setCamera(track);
            else setMic(track);
          });
        },
        (error) => {
          alert(
            "Your camera is not ready!! Get the invitation from your partner and try again!"
          );
          window.close();
        }
      );
    } catch (error) {
      alert("Some thing wrong");
    }

    return () => {
      setRoom((currentRoom) => {
        if (currentRoom && currentRoom.localParticipant.state === "connected") {
          currentRoom.localParticipant.tracks.forEach(function (
            trackPublication
          ) {
            trackPublication.track.stop();
          });

          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [cameraInit, token, roomId]);
  const hangupPhone = async () => {
    try {
      setRoom(async (currentRoom) => {
        try {
          if (
            currentRoom &&
            currentRoom.localParticipant.state === "connected"
          ) {
            currentRoom.localParticipant.tracks.forEach(function (
              trackPublication
            ) {
              trackPublication.track.stop();
            });

            await currentRoom.disconnect();
            window.close();
            return null;
          } else {
            return currentRoom;
          }
        } catch (error) {
          window.close();
        }
      });
    } catch (error) {
      window.close();
    } finally {
      window.close();
    }
  };
  const shareScreen = async () => {
    if (!share) {
      const stream = await navigator.mediaDevices.getDisplayMedia();
      const screenTrack = new LocalVideoTrack(stream.getTracks()[0]);
      room.localParticipant.publishTrack(screenTrack);
      setShare(screenTrack);
    } else {
      share.stop();
      await room.localParticipant.unpublishTrack(share);
      setShare(null);
    }
  };
  const micControl = async () => {
    if (!mic) {
      const audioTrack = await createLocalAudioTrack();
      setRoom((current) => {
        current.localParticipant.publishTrack(audioTrack);
        setMic({ track: audioTrack });
        return current;
      });
    } else {
      setRoom((current) => {
        mic.track.stop();
        current.localParticipant.unpublishTrack(mic.track);
        setMic(null);
        return current;
      });
    }
  };
  const cameraControl = async () => {
    if (!camera) {
      try {
        const videoTrack = await createLocalVideoTrack();
        setRoom((current) => {
          current.localParticipant.publishTrack(videoTrack);
          setCamera({ track: videoTrack });
          return current;
        });
      } catch (error) {
        message.error("No permisstion to open your camera!!");
      }
    } else {
      setRoom((current) => {
        camera.track.stop();
        current.localParticipant.unpublishTrack(camera.track);
        setCamera(null);
        return current;
      });
    }
  };
  return (
    <div className="call-container">
      <div className={expand ? "room expand" : "room"}>
        <div className="icon-out">
          <IconButton onClick={() => setExpand(!expand)}>
            <PanoramaHorizontal />
          </IconButton>
        </div>

        <div className="room-header">
          <div className="logo">
            <img src={Logo} alt="dojve" />
          </div>
          <h3>Vegeta</h3>
          <div className="header-btn">
            <IconButton onClick={() => setExpand(!expand)}>
              <PanoramaWideAngle />
            </IconButton>
          </div>
        </div>
        <div className="room-videos">
          {/* <div className="paticipant focus"> */}
          {participants.length > 0 ? (
            !gridView ? (
              <Slider {...settings}>{remoteParticipants}</Slider>
            ) : (
              <Grid container spacing={3}>
                {gridRemoteParticipants}
              </Grid>
            )
          ) : (
            <div className="inform">
              There is no one in this room, please wait...
            </div>
          )}
          {!!camera && <div className="webcam">{<Webcam />}</div>}
          {/* <div className="paticipants-list">{remoteParticipants}</div> */}
        </div>
        <div className="room-footer">
          <div className="footer-btn">
            <Tooltip title={"Toggle grid view"}>
              <IconButton onClick={() => setGridView((old) => !old)}>
                {!gridView ? <AppsOutlined /> : <ViewCarousel />}
              </IconButton>
            </Tooltip>
            <Popover icon={<PersonAdd />}>
              <Invite sid={room?.sid} />
            </Popover>
          </div>
          <div className="room-footer-control">
            <Tooltip
              title={!share ? "Share screen" : "Stop share screen"}
              aria-label="Recent use"
            >
              <Fab size="medium" onClick={shareScreen} color="primary">
                {!share ? <StopScreenShare /> : <ScreenShare />}
              </Fab>
            </Tooltip>
            <Tooltip
              title={mic ? "Turn off microphone" : "Turn on microphone"}
              aria-label="micro"
            >
              <Fab size="medium" onClick={micControl} color="primary">
                {mic ? <Mic /> : <MicOff />}
              </Fab>
            </Tooltip>
            <Tooltip
              title={camera ? "Turn off camera" : "Turn on camera"}
              aria-label="micro"
            >
              <Fab size="medium" onClick={cameraControl} color="primary">
                {camera ? <VideocamOutlined /> : <VideocamOffOutlined />}
              </Fab>
            </Tooltip>
            <Popconfirm
              placement="topRight"
              title="Cancel this call?"
              onConfirm={hangupPhone}
              okText="Yes"
              cancelText="No"
            >
              <Fab size="medium" color="secondary">
                <CallEnd />
              </Fab>
            </Popconfirm>
          </div>
          <div className="room-footer-exit"></div>
        </div>
      </div>
    </div>
  );
}

export default Call;
