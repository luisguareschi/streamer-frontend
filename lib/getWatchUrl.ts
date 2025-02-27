import { MediaTypeEnum } from "@/api/baseAppBackendAPI.schemas";

export const getWatchUrl = ({
  mediaType,
  tmdbId,
  season,
  episode,
}: {
  mediaType: MediaTypeEnum;
  tmdbId: number;
  season?: number;
  episode?: number;
}) => {
  if (!tmdbId) {
    throw new Error("TMDB ID is required");
  }
  if (!mediaType) {
    throw new Error("Media type is required");
  }
  if (mediaType === MediaTypeEnum.tv && (!season || !episode)) {
    throw new Error("Season and episode are required for TV shows");
  }
  if (mediaType === MediaTypeEnum.movie) {
    return `/watch?mediaType=${mediaType}&id=${tmdbId}`;
  }
  return `/watch?mediaType=${mediaType}&id=${tmdbId}&season=${season}&episode=${episode}`;
};
