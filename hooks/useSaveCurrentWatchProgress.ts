import { useApiShowWatchProgressCreate } from "@/api/api/api";
import {
  MediaTypeEnum,
  MovieDetail,
  TvDetail,
} from "@/api/baseAppBackendAPI.schemas";
import { QUERYKEYS } from "@/queries/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

interface SaveCurrentWatchProgressProps {
  tmdbId: number;
  mediaType: MediaTypeEnum;
  season?: number;
  episode?: number;
  currentTime: number;
  totalDuration: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  movie?: MovieDetail;
  show?: TvDetail;
  isLoading: boolean;
}

export const useSaveCurrentWatchProgress = ({
  isLoading,
  tmdbId,
  mediaType,
  season,
  episode,
  currentTime,
  totalDuration,
  title,
  movie,
  show,
}: SaveCurrentWatchProgressProps) => {
  const queryClient = useQueryClient();
  const { mutate: saveWatchProgress } = useApiShowWatchProgressCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERYKEYS.continueWatchingList],
        });
      },
    },
  });
  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!tmdbId || !mediaType || !title) {
      return;
    }

    if (mediaType === MediaTypeEnum.movie && !movie) {
      return;
    }
    if (mediaType === MediaTypeEnum.tv && !show) {
      return;
    }

    const TIME_BETWEEN_UPDATES = 10000; // seconds in milliseconds
    const now = Date.now();
    if (now - lastUpdateRef.current < TIME_BETWEEN_UPDATES) {
      return;
    }
    lastUpdateRef.current = now;

    saveWatchProgress({
      data: {
        media_type: mediaType,
        tmdb_id: tmdbId,
        poster_path: show?.poster_path || movie?.poster_path || "",
        backdrop_path: show?.backdrop_path || movie?.backdrop_path || "",
        title: title,
        tv_progress:
          mediaType === MediaTypeEnum.tv
            ? [
                {
                  id: 0,
                  season: season || -1,
                  episode: episode || -1,
                  watched_seconds: currentTime,
                  total_seconds: totalDuration,
                },
              ]
            : null,
        movie_progress:
          mediaType === MediaTypeEnum.movie
            ? [
                {
                  id: 0,
                  watched_seconds: currentTime,
                  total_seconds: totalDuration,
                },
              ]
            : null,
      },
    });
  }, [currentTime]);
};
