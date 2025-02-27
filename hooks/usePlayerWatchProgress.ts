import { useState, useEffect } from "react";

interface WatchProgress {
  event: "play" | "pause" | "seeked" | "ended" | "timeupdate";
  currentTime: number;
  duration: number;
  tmdbId: number;
  mediaType: "movie" | "tv";
  season?: number;
  episode?: number;
}

interface PlayerEvent {
  type: "PLAYER_EVENT";
  data: WatchProgress;
}

export const usePlayerWatchProgress = () => {
  const [watchProgress, setWatchProgress] = useState<WatchProgress>();

  useEffect(() => {
    window.addEventListener("message", (event: MessageEvent<PlayerEvent>) => {
      if (event.origin !== "https://vidlink.pro") return;

      if (event.data?.type === "PLAYER_EVENT") {
        setWatchProgress(event.data.data);
      }
    });
  }, []);
  return { watchProgress };
};
