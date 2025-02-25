/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MediaTypeEnum, TvDetail } from "@/api/baseAppBackendAPI.schemas";
import { MovieDetail } from "@/api/baseAppBackendAPI.schemas";
import dayjs from "dayjs";
import { X } from "lucide-react";
import { useState } from "react";
import { useApiShowsGetTvEpisodesRetrieve } from "@/api/api/api";
import { EpisodeList, EpisodeListProps } from "./episode-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EpisodeDrawerProps {
  tv?: TvDetail;
  movie?: MovieDetail;
}

const Tag = ({ children }: { children: React.ReactNode }) => {
  return (
    <p className="text-white font-light p-1 px-3 border border-neutral-400 w-fit rounded-full text-center text-sm">
      {children}
    </p>
  );
};

export const EpisodeDrawer = ({ tv, movie }: EpisodeDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [seasonNumber, setSeasonNumber] = useState(1);
  const { data: episodes, isLoading: isLoadingEpisodes } =
    useApiShowsGetTvEpisodesRetrieve(
      {
        tv_id: tv?.id || 0,
        season_number: seasonNumber,
      },
      {
        query: {
          enabled: !!tv,
        },
      },
    );
  const posterUrl = tv?.poster_path || movie?.poster_path || "";
  const title = tv?.name || movie?.title || "";
  const releaseDate = tv?.first_air_date || movie?.release_date || "";
  const mediaType = tv ? "tv" : "movie";
  const numberOfEpisodes = tv?.number_of_episodes || 1;
  const numberOfSeasons = tv?.number_of_seasons || 1;

  const episodesList = (): EpisodeListProps["episodes"] => {
    if (movie) {
      return [
        {
          id: movie.id,
          name: movie.title,
          duration: movie.runtime,
          mediaType: MediaTypeEnum.movie,
          tmdbId: movie.id,
        },
      ];
    }
    if (tv) {
      return (
        episodes?.episodes?.map((episode) => ({
          id: episode.id,
          number: episode.episode_number,
          name: episode.name,
          duration: episode.runtime,
          mediaType: MediaTypeEnum.tv,
          season: episode.season_number,
          tmdbId: tv.id,
        })) || []
      );
    }
    return [];
  };

  return (
    <Drawer dismissible={false} open={isOpen}>
      <DrawerTrigger onClick={() => setIsOpen(true)}>
        <Button className="w-full mt-4" variant="roundedWhite" size="xl">
          Watch Now
        </Button>
      </DrawerTrigger>
      <DrawerContent
        className="h-[100vh] bg-neutral-400/10 backdrop-blur-lg border-none rounded-none p-4 flex flex-col gap-6"
        showPill={false}
      >
        <DrawerClose asChild onClick={() => setIsOpen(false)}>
          <Button
            variant="glass"
            size="icon"
            className="bg-transparent backdrop-blur-none"
            onClick={() => null}
          >
            <X className="size-6 min-w-6 min-h-6" />
          </Button>
        </DrawerClose>
        <header className="flex gap-6">
          <img
            src={posterUrl}
            alt={tv?.name || movie?.title}
            className="object-cover aspect-[2/3] h-56 rounded-xl shadow-inner"
          />
          <div className="flex flex-col gap-3 justify-center">
            <h3 className="text-white text-lg font-semibold">
              {mediaType.toUpperCase()}
            </h3>
            <h1 className="text-3xl font-semibold text-white">{title}</h1>
            <h2 className="text-white font-light">
              {dayjs(releaseDate).format("MMM YYYY")}
            </h2>
            <div className="flex gap-2 flex-wrap">
              {tv && (
                <>
                  <Tag>{numberOfEpisodes} Ep</Tag>
                  <Tag>{numberOfSeasons} Seasons</Tag>
                </>
              )}
              {movie && (
                <>
                  <Tag>HD</Tag>
                  <Tag>SUB</Tag>
                </>
              )}
            </div>
          </div>
        </header>
        {tv && (
          <Select
            value={seasonNumber.toString()}
            onValueChange={(value) => setSeasonNumber(Number(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-neutral-200/80 backdrop-blur-sm border-none rounded-xl">
              {Array.from({ length: numberOfSeasons }).map((_, index) => (
                <SelectItem
                  key={index}
                  value={String(index + 1)}
                  className="text-neutral-900 rounded-lg text-base"
                >
                  Season {index + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {movie && (
          <Button variant="roundedWhite" className="w-full" size="xl">
            Watch Movie
          </Button>
        )}
        <EpisodeList episodes={episodesList()} isLoading={isLoadingEpisodes} />
      </DrawerContent>
    </Drawer>
  );
};
