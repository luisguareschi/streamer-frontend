"use client";
import { HorizontalShowList } from "@/components/common/horizontal-show-list";
import { useApiShowsTrendingRetrieve } from "@/api/api/api";

const Home = () => {
  const { data: trendingShows, isLoading: loadingTrendingShows } =
    useApiShowsTrendingRetrieve();
  return (
    <div className="flex flex-col items-center justify-start h-screen p-4">
      <HorizontalShowList
        title="Trending Shows"
        shows={trendingShows?.results?.map((show) => ({
          imgUrl: show.poster_path || "",
          id: show.id,
          mediaType: show.media_type,
        }))}
        isLoading={loadingTrendingShows}
      />
      <HorizontalShowList
        title="Trending Shows"
        shows={trendingShows?.results?.map((show) => ({
          imgUrl: show.poster_path || "",
          id: show.id,
          mediaType: show.media_type,
        }))}
        isLoading={loadingTrendingShows}
      />
      <HorizontalShowList
        title="Trending Shows"
        shows={trendingShows?.results?.map((show) => ({
          imgUrl: show.poster_path || "",
          id: show.id,
          mediaType: show.media_type,
        }))}
        isLoading={loadingTrendingShows}
      />
      <HorizontalShowList
        title="Trending Shows"
        shows={trendingShows?.results?.map((show) => ({
          imgUrl: show.poster_path || "",
          id: show.id,
          mediaType: show.media_type,
        }))}
        isLoading={loadingTrendingShows}
      />
      <HorizontalShowList
        title="Trending Shows"
        shows={trendingShows?.results?.map((show) => ({
          imgUrl: show.poster_path || "",
          id: show.id,
          mediaType: show.media_type,
        }))}
        isLoading={loadingTrendingShows}
      />
      <HorizontalShowList
        title="Trending Shows"
        shows={trendingShows?.results?.map((show) => ({
          imgUrl: show.poster_path || "",
          id: show.id,
          mediaType: show.media_type,
        }))}
        isLoading={loadingTrendingShows}
      />
    </div>
  );
};

export default Home;
