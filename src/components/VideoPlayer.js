import React, { useEffect } from 'react';
import './VideoPlayer.css';

function VideoPlayer({ videoRef, clip, currentGame, handleVideoEnded }) {
  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl) {
      const newSrc = `${process.env.PUBLIC_URL}/clips/${currentGame}/${clip}.mp4`;
      videoEl.src = newSrc;
      videoEl.onloadeddata = () => {
        // Ensure the element is still available before calling play.
        if (videoEl) {
          videoEl.play().catch(err => {
            console.error('Play failed:', err);
          });
        }
      };
      videoEl.load();
    }
    // Cleanup: remove the event handler when the effect is cleaned up.
    return () => {
      if (videoEl) {
        videoEl.onloadeddata = null;
      }
    };
  }, [clip, currentGame, videoRef]);

  return (
    <video
      className="video-player"
      playsInline
      webkit-playsinline="true"
      controls={false}
      ref={videoRef}
      width="640"
      onEnded={handleVideoEnded}
      preload="auto"
    >
      Your browser does not support the video tag.
    </video>
  );
}

export default VideoPlayer;