import React, { useRef, useState } from "react";
import "./VideoPlayer.css";

const VideoPlayer: React.FC = () => {
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const seekBarRef = useRef<HTMLInputElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [seekBarHoverPosition, setSeekBarHoverPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const handlePlayPause = () => {
    if (videoRef.current?.paused) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current?.currentTime || 0);
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current?.duration || 0);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLInputElement>) => {
    const seekBarRect = seekBarRef.current?.getBoundingClientRect();
    if (seekBarRect) {
      const hoverTime =
        ((e.nativeEvent.clientX - seekBarRect.left) / seekBarRect.width) *
        duration;
      setHoverTime(hoverTime);

      setSeekBarHoverPosition({
        top: seekBarRect.top - 160,
        left: e.clientX,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
    setSeekBarHoverPosition(null);
  };

  const getThumbnailSrc = (time: number) => {
    return `/thumbnails/snapshot-${String(Math.round(time)).padStart(
      3,
      "0"
    )}.jpg`;
  };

  const handleFullscreenToggle = () => {
    if (videoContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoContainerRef.current.requestFullscreen().catch((error) => {
          console.error("Error attempting to enable fullscreen:", error);
        });
      }
    }
  };

  return (
    <div className="w-[60%] mx-auto">
      <div ref={videoContainerRef} className="video-container">
        <video
          ref={videoRef}
          src="pug.mp4"
          width="100%"
          height="auto"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
      </div>
      <div className="custom-timeline-container">
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handlePlayPause}
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <span className="text-gray-600">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <div className="relative w-full">
            <input
              ref={seekBarRef}
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full h-2 rounded-full bg-gray-300 appearance-none cursor-pointer"
            />
            {seekBarHoverPosition !== null && (
              <div
                className="tooltip"
                style={{
                  top: `${seekBarHoverPosition.top}px`,
                  left: `${seekBarHoverPosition.left}px`,
                }}
              >
                {hoverTime !== null && (
                  <>
                    <img
                      src={getThumbnailSrc(hoverTime)}
                      alt={`Thumbnail at ${formatTime(hoverTime)}`}
                      className="preview-thumbnail"
                    />
                    <span className="preview-time">
                      {formatTime(hoverTime)}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={handleFullscreenToggle}
        >
          Toggle Fullscreen
        </button>
      </div>
    </div>
  );
};

const formatTime = (timeInSeconds: number): string => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);

  const formattedHours = hours > 0 ? `${hours}:` : "";
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
};

export default VideoPlayer;
