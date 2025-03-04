import { Separator } from "@/components/ui/separator";
import { BarLoader } from "../bar-loader";
import { MediaTypeEnum } from "@/api/baseAppBackendAPI.schemas";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { getWatchUrl } from "@/lib/getWatchUrl";
import { useApiShowWatchProgressProgressRetrieve } from "@/api/api/api";
import { Progress } from "@/components/ui/progress";

interface EpisodeItemProps {
  id: number;
  number?: number;
  name: string;
  duration: number;
  mediaType: MediaTypeEnum;
  season?: number;
  tmdbId: number;
  releaseDate: string;
  progress?: number;
}

const EpisodeItem = ({
  number,
  name,
  duration,
  mediaType,
  season = 0,
  tmdbId,
  releaseDate,
  progress,
}: EpisodeItemProps) => {
  const router = useRouter();
  const isReleased = dayjs(releaseDate).isBefore(dayjs());
  const releaseDateFormatted = dayjs(releaseDate).format("MMM D, YYYY");

  const handleClick = () => {
    router.replace(getWatchUrl({ mediaType, tmdbId, season, episode: number }));
  };

  return (
    <button
      className="flex justify-between items-center gap-2 py-3 w-full rounded-md active:bg-neutral-500/20 transition-all disabled:opacity-50"
      onClick={handleClick}
      disabled={!isReleased}
    >
      <div className="flex flex-col gap-1 w-full items-start">
        <h2 className="text-neutral-400">
          {mediaType === MediaTypeEnum.movie
            ? "Watch Movie"
            : `Episode ${number}`}{" "}
          {!isReleased && (
            <span className="text-red-500">{`Not aired (${releaseDateFormatted})`}</span>
          )}
        </h2>
        <h3 className="text-white line-clamp-1">{name}</h3>
        {progress && (
          <Progress
            value={progress}
            className="w-full h-1.5 bg-neutral-600 mt-2"
          />
        )}
      </div>
      <p className="text-neutral-400 min-w-fit">{duration || "?"} min</p>
    </button>
  );
};

export interface EpisodeListProps {
  episodes: EpisodeItemProps[];
  isLoading?: boolean;
}

export const EpisodeList = ({ episodes, isLoading }: EpisodeListProps) => {
  const tmdbId = episodes[0]?.tmdbId;
  const { data: showWatchProgress, isLoading: isLoadingProgress } =
    useApiShowWatchProgressProgressRetrieve(tmdbId?.toString() || "", {
      query: {
        enabled: !!tmdbId,
        queryKey: ["current-show-watch-progress", tmdbId],
      },
    });

  const getEpisodeProgress = (
    episode: EpisodeItemProps,
  ): number | undefined => {
    if (!showWatchProgress) return undefined;
    if (showWatchProgress.media_type === MediaTypeEnum.movie) {
      const movieProgress = showWatchProgress.movie_progress?.[0];
      return (
        ((movieProgress?.watched_seconds || 1) /
          (movieProgress?.total_seconds || 1)) *
        100
      );
    }
    const tvProgress = showWatchProgress.tv_progress?.find(
      (progress) =>
        progress.season === episode.season &&
        progress.episode === episode.number,
    );
    if (!tvProgress) return undefined;
    return (
      ((tvProgress.watched_seconds || 1) / (tvProgress.total_seconds || 1)) *
      100
    );
  };

  const isLoadingAll = isLoading || isLoadingProgress;

  return (
    <div className="flex flex-col overflow-y-auto no-scrollbar">
      {!isLoadingAll &&
        episodes.map((episode, index) => (
          <div key={episode.id}>
            <EpisodeItem {...episode} progress={getEpisodeProgress(episode)} />
            {index !== episodes.length - 1 && (
              <Separator className="w-full bg-neutral-500" />
            )}
          </div>
        ))}
      {isLoadingAll && (
        <div className="flex justify-center items-center w-full mt-10">
          <BarLoader className="min-w-[200px]" />
        </div>
      )}
    </div>
  );
};
