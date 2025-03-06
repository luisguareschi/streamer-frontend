"use client";
import { useApiShowsMovieRetrieve, useApiShowsTvRetrieve } from "@/api/api/api";
import { MediaTypeEnum } from "@/api/baseAppBackendAPI.schemas";
import FullScreenLoading from "@/components/common/full-screen-loading";
import { AboutCard } from "@/components/common/show-details/about-card";
import { Header } from "@/components/common/show-details/header";
import { useParams, useSearchParams } from "next/navigation";

const ShowDetailPage = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const mediaType = searchParams.get("mediaType") as MediaTypeEnum;

  if (!mediaType) {
    throw new Error("Media type is required");
  }

  if (!Object.values(MediaTypeEnum).includes(mediaType)) {
    throw new Error("Invalid media type");
  }

  const { data: movie, isLoading: isMovieLoading } = useApiShowsMovieRetrieve(
    id as string,
    {
      query: { enabled: !!id && mediaType === MediaTypeEnum.movie },
    },
  );
  const { data: show, isLoading: isShowLoading } = useApiShowsTvRetrieve(
    id as string,
    {
      query: { enabled: !!id && mediaType === MediaTypeEnum.tv },
    },
  );

  const backdropPath = movie?.backdrop_path || show?.backdrop_path;
  const genres = movie?.genres || show?.genres;
  const data = movie
    ? `${movie?.runtime} min`
    : `${show?.number_of_episodes} Episodes`;
  const rating = movie?.vote_average || show?.vote_average || 0;
  const isLoading = isMovieLoading || isShowLoading;

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full z-20 flex flex-col bg-black overflow-y-auto">
      <div
        className="w-full h-full bg-cover bg-center z-10 fixed top-0 left-0"
        style={{
          backgroundImage: `url(${backdropPath})`,
        }}
      />
      <div className="fixed top-0 left-0 z-10 h-[100vh] w-full bottom-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />

      <div className="flex flex-col justify-between min-h-[100vh] relative z-20 p-4 pb-10 sm:justify-center sm:items-center">
        <Header show={movie || show} mediaType={mediaType} />
        <AboutCard
          title={movie?.title || show?.name || ""}
          description={movie?.overview || show?.overview || ""}
          rating={rating}
          releaseDate={movie?.release_date || show?.first_air_date || ""}
          genres={genres?.map((genre) => genre.name) || []}
          data={data}
          tv={show}
          movie={movie}
        />
      </div>
    </div>
  );
};

export default ShowDetailPage;
