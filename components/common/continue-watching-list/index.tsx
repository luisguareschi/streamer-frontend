/* eslint-disable @next/next/no-img-element */
"use client";
import { useApiShowWatchProgressList } from "@/api/api/api";
import {
  MediaTypeEnum,
  ShowWatchProgress,
} from "@/api/baseAppBackendAPI.schemas";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getWatchUrl } from "@/lib/getWatchUrl";
import { QUERYKEYS } from "@/queries/queryKeys";
import { Info, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArchiveShowModal } from "@/components/common/archive-show-modal";

const ContinueWatchingCard = ({ show }: { show: ShowWatchProgress }) => {
  const router = useRouter();
  const [archiveShowModalOpen, setArchiveShowModalOpen] = useState(false);
  const totalSeconds =
    show.last_watched_episode?.total_seconds ||
    show.movie_progress?.[0]?.total_seconds ||
    0;
  const watchedSeconds =
    show.last_watched_episode?.watched_seconds ||
    show.movie_progress?.[0]?.watched_seconds ||
    0;
  const minutesLeft = Math.floor((totalSeconds - watchedSeconds) / 60);

  const handleInfoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(
      `/show/${show.tmdb_id}?mediaType=${show.media_type}&episodeDrawer=true&seasonNumber=${show.last_watched_episode?.season}`,
    );
  };

  const handleRemoveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setArchiveShowModalOpen(true);
  };

  return (
    <>
      <Link
        href={getWatchUrl({
          mediaType: show.media_type,
          tmdbId: show.tmdb_id,
          season: show.last_watched_episode?.season,
          episode: show.last_watched_episode?.episode,
        })}
        className="flex flex-col justify-end gap-0 aspect-video rounded-xl min-w-[300px] relative p-4 overflow-hidden"
      >
        <img
          src={show.backdrop_path}
          alt={show.title}
          className="absolute top-0 left-0 w-full h-full object-cover brightness-75 active:scale-110 transition-all"
        />
        <p className="text-sm text-neutral-300 relative">
          {minutesLeft} min left
        </p>
        <h1 className="text-lg text-white font-medium relative">
          {show.title}
          {" - "}
          {show.media_type === MediaTypeEnum.tv &&
            `S${show.last_watched_episode?.season}E${show.last_watched_episode?.episode}`}
        </h1>
        <Progress
          value={(watchedSeconds / totalSeconds) * 100}
          className="h-1 bg-opacity-50 backdrop-blur-sm mt-2"
        />
        <Button
          variant="glass"
          size="icon"
          className="absolute top-1 left-1 size-8 bg-transparent backdrop-blur-none rounded-full"
          onClick={handleInfoClick}
        >
          <Info className="min-w-5 min-h-5" />
        </Button>
        <Button
          variant="glass"
          size="icon"
          className="absolute top-1 right-1 size-8 bg-transparent backdrop-blur-none rounded-full"
          onClick={handleRemoveClick}
        >
          <X className="min-w-5 min-h-5" />
        </Button>
      </Link>
      <ArchiveShowModal
        tmdbId={show.tmdb_id}
        open={archiveShowModalOpen}
        onClose={() => setArchiveShowModalOpen(false)}
      />
    </>
  );
};

export const ContinueWatchingList = () => {
  const { data: shows, isLoading } = useApiShowWatchProgressList({
    query: {
      queryKey: [QUERYKEYS.continueWatchingList],
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchInterval: 1000 * 60 * 5, // 5 minutes
    },
  });

  if (!isLoading && shows?.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-lg text-white">Continue Watching</h1>
      <div className="flex overflow-x-auto no-scrollbar gap-4">
        {shows?.map((show) => (
          <ContinueWatchingCard key={show.id} show={show} />
        ))}
        {isLoading && (
          <div className="w-[300px] h-full bg-neutral-800 rounded-xl aspect-video animate-pulse" />
        )}
      </div>
    </div>
  );
};
