"use client";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ApiWatchGetWatchUrlRetrieveParams,
  MediaTypeEnum,
} from "@/api/baseAppBackendAPI.schemas";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import {
  useApiShowsMovieRetrieve,
  useApiShowsTvRetrieve,
  useApiShowWatchProgressProgressRetrieve,
  useApiWatchGetWatchUrlRetrieve,
} from "@/api/api/api";
import FullScreenLoading from "@/components/common/full-screen-loading";
import { Suspense, useEffect, useRef, useState } from "react";
import { Player, DefaultUi, Hls } from "@vime/react";
import "@vime/core/themes/default.css";
import { useSaveCurrentWatchProgress } from "@/hooks/useSaveCurrentWatchProgress";
import { cn } from "@/lib/utils";

const WatchPage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const mediaType: MediaTypeEnum = params.get("mediaType") as MediaTypeEnum;
  const season = params.get("season");
  const episode = params.get("episode");
  const tmdbId = params.get("id");
  const playerRef = useRef<HTMLVmPlayerElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  if (!tmdbId) {
    throw new Error("No ID");
  }
  if (!mediaType || !Object.values(MediaTypeEnum).includes(mediaType)) {
    throw new Error(
      "No media type. Valid types: " + Object.values(MediaTypeEnum).join(", "),
    );
  }
  if (mediaType === MediaTypeEnum.tv && !season) {
    throw new Error("No season");
  }
  if (mediaType === MediaTypeEnum.tv && !episode) {
    throw new Error("No episode");
  }

  const {
    data: watchUrl,
    isLoading: isWatchUrlLoading,
    isError: urlNotFound,
  } = useApiWatchGetWatchUrlRetrieve(
    {
      tmdb_id: parseInt(tmdbId),
      media_type:
        mediaType as unknown as ApiWatchGetWatchUrlRetrieveParams["media_type"],
      season_number: season ? parseInt(season) : undefined,
      episode_number: episode ? parseInt(episode) : undefined,
    },
    {
      query: {
        retry: false,
        throwOnError: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    },
  );

  const url = watchUrl?.url;

  const { data: show, isLoading: isShowLoading } = useApiShowsTvRetrieve(
    tmdbId,
    {
      query: {
        enabled: !!tmdbId && mediaType === MediaTypeEnum.tv,
      },
    },
  );
  const { data: movie, isLoading: isMovieLoading } = useApiShowsMovieRetrieve(
    tmdbId,
    {
      query: {
        enabled: !!tmdbId && mediaType === MediaTypeEnum.movie,
      },
    },
  );
  const { data: showWatchProgress, isLoading: isShowWatchProgressLoading } =
    useApiShowWatchProgressProgressRetrieve(tmdbId, {
      query: {
        enabled: !!tmdbId,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
      },
    });

  const isLoading =
    isShowLoading ||
    isMovieLoading ||
    isShowWatchProgressLoading ||
    isWatchUrlLoading;

  const title = mediaType === MediaTypeEnum.movie ? movie?.title : show?.name;
  const header =
    mediaType === MediaTypeEnum.movie
      ? title
      : `${title} - S${season}E${episode}`;

  const getStartAtTime = () => {
    let startAt = undefined;
    if (!showWatchProgress) {
      return undefined;
    }
    if (mediaType === MediaTypeEnum.movie) {
      startAt = showWatchProgress?.movie_progress?.[0]?.watched_seconds || 0;
    }
    if (mediaType === MediaTypeEnum.tv) {
      startAt =
        showWatchProgress?.tv_progress?.find(
          (progress) =>
            progress.season === parseInt(season || "-1") &&
            progress.episode === parseInt(episode || "-1"),
        )?.watched_seconds || 0;
    }
    return startAt ? startAt.toFixed(0) : undefined;
  };

  // Set the start time and play the video
  useEffect(() => {
    if (playerRef.current && !isLoading) {
      const startTime = getStartAtTime() || "0";

      const onPlayerReady = () => {
        if (!playerRef.current) {
          return;
        }
        playerRef.current.currentTime = parseInt(startTime);
        playerRef.current.play();
      };

      const player = playerRef.current;
      player.addEventListener("vmPlaybackReady", onPlayerReady);

      return () => {
        player.removeEventListener("vmPlaybackReady", onPlayerReady);
      };
    }
  }, [url, isLoading]);

  useSaveCurrentWatchProgress({
    isLoading,
    tmdbId: parseInt(tmdbId),
    mediaType,
    season: season ? parseInt(season) : undefined,
    episode: episode ? parseInt(episode) : undefined,
    currentTime,
    totalDuration: playerRef.current?.duration || -1,
    title: title || "",
    poster_path: show?.poster_path || movie?.poster_path || "",
    backdrop_path: show?.backdrop_path || movie?.backdrop_path || "",
    movie,
    show,
  });

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="fixed top-0 left-0 bg-black flex flex-col h-full w-full justify-center items-center z-20">
      <div
        className="absolute top-0 left-0 p-4 w-full grid justify-items-start items-center gap-2"
        style={{
          gridTemplateColumns: "1fr auto 1fr",
        }}
      >
        <Button
          variant="glass"
          onClick={() =>
            router.replace(
              `/show/${tmdbId}?mediaType=${mediaType}&episodeDrawer=true&seasonNumber=${season}`,
            )
          }
          className="bg-transparent px-3 text-base"
          size="xl"
        >
          <ArrowLeftIcon className="w-5 h-5 min-w-5 min-h-5" />
          Back
        </Button>
        <h1 className="font-medium text-white text-center line-clamp-1">
          {header}
        </h1>
      </div>
      <div
        className={cn(
          "w-full aspect-video lg:w-2/3 lg:border-2 lg:border-gray-800 lg:rounded-lg",
          urlNotFound && "hidden",
        )}
      >
        <Player
          ref={playerRef}
          autoplay
          onVmCurrentTimeChange={(e) => setCurrentTime(e.detail)}
        >
          <Hls version="latest" poster={watchUrl?.backdrop_path} crossOrigin="">
            <source data-src={url} type="application/x-mpegURL" />
          </Hls>
          <DefaultUi />
        </Player>
      </div>
      {urlNotFound && (
        <div className="flex flex-col gap-2 justify-center items-center px-2">
          <h1 className="text-white font-semibold text-center text-lg">
            Oops! We couldn&apos;t find the video you&apos;re looking for.
          </h1>
          <p className="text-neutral-300 flex flex-col items-center gap-2 text-center">
            We try to host all the videos, but sometimes it doesn&apos;t work.
          </p>
        </div>
      )}
    </div>
  );
};

const Wrapper = () => {
  return (
    <Suspense>
      <WatchPage />
    </Suspense>
  );
};

export default Wrapper;
