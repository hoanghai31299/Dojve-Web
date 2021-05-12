import React, { useEffect, useRef } from "react";

function VideoTrack({ videoTrack }) {
  const videoRef = useRef();
  useEffect(() => {
    if (videoTrack) {
      videoRef.current.load();
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTrack]);

  return (
    <React.Fragment>
      <video ref={videoRef} autoPlay={true} />
    </React.Fragment>
  );
}

export default VideoTrack;
