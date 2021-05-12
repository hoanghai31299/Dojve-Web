// import { LinearProgress } from "@material-ui/core";
import { Avatar } from "@material-ui/core";
import { message } from "antd";
import React, { useState, useEffect } from "react";
import { getFirstLetter } from "../../utils/common";
import AudioTrack from "./AudioTrack";
import VideoTrack from "./VideoTrack";
const Participant = ({ participant }) => {
  console.log(participant.identity);
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);
  useEffect(() => {
    const trackSubscribed = (track) => {
      try {
        if (track.kind === "video") {
          setVideoTracks((videoTracks) => [...videoTracks, track]);
        } else {
          setAudioTracks((audioTracks) => [...audioTracks, track]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const trackUnsubscribed = (track) => {
      try {
        console.log(track);
        if (track.kind === "video") {
          setVideoTracks((videoTracks) =>
            videoTracks.filter((v) => v.sid !== track.sid)
          );
        } else {
          setAudioTracks((audioTracks) =>
            audioTracks.filter((a) => a.sid !== track.sid)
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));
    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);
  return (
    <div
      className={
        videoTracks.length === 2
          ? "participant-video grid"
          : "participant-video"
      }
    >
      <span>{participant.identity}</span>
      {videoTracks.length === 0 ? (
        <div className="participant-avatar">
          <Avatar>{getFirstLetter(participant.identity)}</Avatar>
        </div>
      ) : (
        videoTracks.map((video) => (
          <VideoTrack key={video.name} videoTrack={video} />
        ))
      )}
      {audioTracks.map((audio) => (
        <AudioTrack key={audio.name} audioTrack={audio} />
      ))}
    </div>
  );
};

export default Participant;
