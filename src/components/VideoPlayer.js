import React from 'react';
import './VideoPlayer.css';

function VideoPlayer({ videoRef, clip, currentGame, handleVideoEnded }) {
  return (
    <video
      className="video-player"
      playsInline
      webkit-playsinline="true"
      controls={false}
      ref={videoRef}
      key={clip}
      autoPlay
      width="640"
      onEnded={handleVideoEnded}
      src={`${process.env.PUBLIC_URL}/clips/${currentGame}/${clip}.mp4`}
    >
      Your browser does not support the video tag.
    </video>
  );
}

export default VideoPlayer;