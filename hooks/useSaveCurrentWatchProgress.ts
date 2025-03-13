import { useApiShowWatchProgressCreate } from "@/api/api/api";
import {
  MediaTypeEnum,
  MovieDetail,
  TvDetail,
} from "@/api/baseAppBackendAPI.schemas";
import { QUERYKEYS } from "@/queries/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTimer } from "./useTimer";

interface SaveCurrentWatchProgressProps {
  tmdbId: number;
  mediaType: MediaTypeEnum;
  season?: number;
  episode?: number;
  currentTime: number;
  totalDuration: number;
  title: string;
  movie?: MovieDetail;
  show?: TvDetail;
}

export const useSaveCurrentWatchProgress = ({
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
  const timer = useTimer({ timeBetweenUpdates: 10000 });
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

  useEffect(() => {
    if (!tmdbId || !mediaType || !title || !totalDuration) {
      return;
    }
    if (mediaType === MediaTypeEnum.movie && !movie) {
      return;
    }
    if (mediaType === MediaTypeEnum.tv && !show) {
      return;
    }

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
  }, [timer]);
};
