import React, { useEffect, useRef } from "react";

function AudioTrack({ audioTrack }) {
  const audioRef = useRef();
  useEffect(() => {
    if (audioTrack) {
      audioTrack.attach && audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach && audioTrack.detach();
      };
    }
  }, [audioTrack]);
  return (
    <div>
      <audio ref={audioRef} autoPlay={true} muted={false} />
    </div>
  );
}

export default AudioTrack;
