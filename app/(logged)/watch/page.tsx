"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { MediaTypeEnum } from "@/api/baseAppBackendAPI.schemas";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import {
  useApiShowsMovieRetrieve,
  useApiShowsTvRetrieve,
  useApiShowWatchProgressCreate,
} from "@/api/api/api";
import FullScreenLoading from "@/components/common/full-screen-loading";
import { Suspense, useEffect } from "react";
import { usePlayerWatchProgress } from "@/hooks/usePlayerWatchProgress";

const WatchPage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const mediaType: MediaTypeEnum = params.get("mediaType") as MediaTypeEnum;
  const season = params.get("season");
  const episode = params.get("episode");
  const tmdbId = params.get("id");
  const { mutate: saveWatchProgress } = useApiShowWatchProgressCreate();
  const { watchProgress } = usePlayerWatchProgress();

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

  const isLoading = isShowLoading || isMovieLoading;

  const title = mediaType === MediaTypeEnum.movie ? movie?.title : show?.name;
  const header =
    mediaType === MediaTypeEnum.movie
      ? title
      : `${title} - S${season}E${episode}`;

  // https://vidlink.pro/tv/{tmdbId}/{season}/{episode}
  // https://vidlink.pro/movie/{tmdbId}

  const url =
    mediaType === MediaTypeEnum.movie
      ? `https://vidlink.pro/movie/${tmdbId}`
      : `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`;

  useEffect(() => {
    if (watchProgress?.event !== "timeupdate") {
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

    if (watchProgress?.event === "timeupdate") {
      saveWatchProgress({
        data: {
          media_type: mediaType,
          tmdb_id: parseInt(tmdbId),
          poster_path: show?.poster_path || movie?.poster_path || "",
          backdrop_path: show?.backdrop_path || movie?.backdrop_path || "",
          title: title,
          tv_progress:
            mediaType === MediaTypeEnum.tv
              ? [
                  {
                    id: 0,
                    season: parseInt(season || "-1"),
                    episode: parseInt(episode || "-1"),
                    watched_seconds: watchProgress.currentTime,
                    total_seconds: watchProgress.duration,
                  },
                ]
              : null,
          movie_progress:
            mediaType === MediaTypeEnum.movie
              ? [
                  {
                    id: 0,
                    watched_seconds: watchProgress.currentTime,
                    total_seconds: watchProgress.duration,
                  },
                ]
              : null,
        },
      });
    }
  }, [watchProgress]);

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="fixed top-0 left-0 bg-black flex flex-col h-full w-full justify-center items-center z-10">
      <div
        className="absolute top-0 left-0 p-4 w-full grid justify-items-start items-center gap-2"
        style={{
          gridTemplateColumns: "1fr auto 1fr",
        }}
      >
        <Button
          variant="glass"
          onClick={() => router.back()}
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
      <iframe
        src={url}
        allowFullScreen
        className="w-full aspect-video"
        referrerPolicy="no-referrer"
        allow="autoplay; encrypted-media"
      />
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
