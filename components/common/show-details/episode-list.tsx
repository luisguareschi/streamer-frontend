import { Separator } from "@/components/ui/separator";
import { BarLoader } from "../bar-loader";
import { MediaTypeEnum } from "@/api/baseAppBackendAPI.schemas";
import { useRouter } from "next/navigation";

interface EpisodeItemProps {
  id: number;
  number?: number;
  name: string;
  duration: number;
  mediaType: MediaTypeEnum;
  season?: number;
  tmdbId: number;
}

const EpisodeItem = ({
  number,
  name,
  duration,
  mediaType,
  season = 0,
  tmdbId,
}: EpisodeItemProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (mediaType === MediaTypeEnum.movie) {
      router.push(`/watch?mediaType=${mediaType}&id=${tmdbId}`);
      return;
    }
    router.push(
      `/watch?mediaType=${mediaType}&id=${tmdbId}&season=${season}&episode=${number}`,
    );
  };

  return (
    <button
      className="flex justify-between items-center py-3 w-full rounded-md active:bg-neutral-500/20 transition-all"
      onClick={handleClick}
    >
      <div className="flex flex-col gap-1 w-full items-start">
        <h2 className="text-neutral-400">
          {mediaType === MediaTypeEnum.movie
            ? "Watch Movie"
            : `Episode ${number}`}
        </h2>
        <h3 className="text-white line-clamp-1">{name}</h3>
      </div>
      <p className="text-neutral-400 min-w-fit">{duration} min</p>
    </button>
  );
};

export interface EpisodeListProps {
  episodes: EpisodeItemProps[];
  isLoading?: boolean;
}

export const EpisodeList = ({ episodes, isLoading }: EpisodeListProps) => {
  return (
    <div className="flex flex-col overflow-y-auto no-scrollbar">
      {!isLoading &&
        episodes.map((episode, index) => (
          <div key={episode.id}>
            <EpisodeItem {...episode} />
            {index !== episodes.length - 1 && (
              <Separator className="w-full bg-neutral-500" />
            )}
          </div>
        ))}
      {isLoading && (
        <div className="flex justify-center items-center w-full mt-10">
          <BarLoader className="min-w-[200px]" />
        </div>
      )}
    </div>
  );
};
