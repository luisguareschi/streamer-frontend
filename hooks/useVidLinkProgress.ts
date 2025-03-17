import { useEffect, useState } from "react";

interface VidLinkEvent {
  type: "PLAYER_EVENT";
  data: {
    event: "play" | "pause" | "seeked" | "ended" | "timeupdate";
    currentTime: number;
    duration: number;
    mtmdbId: number;
    mediaType: "movie" | "tv";
    season?: number;
    episode?: number;
  };
}

export const useVidLinkProgress = () => {
  const [progress, setProgress] = useState<VidLinkEvent | null>(null);

  useEffect(() => {
    window.addEventListener("message", (event: MessageEvent<VidLinkEvent>) => {
      if (event.origin !== "https://vidlink.pro") return;

      if (event.data?.type === "PLAYER_EVENT") {
        setProgress(event.data);
      }
    });
  }, []);

  return { progress };
};
