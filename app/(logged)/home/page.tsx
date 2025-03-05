"use client";
import { HorizontalShowList } from "@/components/common/horizontal-show-list";
import {
  useApiShowsPopularRetrieve,
  useApiShowsTrendingRetrieve,
} from "@/api/api/api";
import {
  ApiShowsPopularRetrieveMediaType,
  ApiShowsTrendingRetrieveTimeWindow,
} from "@/api/baseAppBackendAPI.schemas";
import { TopPicksList } from "@/components/common/top-picks-list";
import { ContinueWatchingList } from "@/components/common/continue-watching-list";
import { AdblockBanner } from "@/components/common/adblock-banner";

const Home = () => {
  const { data: trendingShowsToday, isLoading: loadingTrendingShowsToday } =
    useApiShowsTrendingRetrieve({
      time_window: ApiShowsTrendingRetrieveTimeWindow.day,
    });
  const { data: trendingShowsWeek, isLoading: loadingTrendingShowsWeek } =
    useApiShowsTrendingRetrieve({
      time_window: ApiShowsTrendingRetrieveTimeWindow.week,
    });
  const { data: popularTv, isLoading: loadingPopularTv } =
    useApiShowsPopularRetrieve({
      media_type: ApiShowsPopularRetrieveMediaType.tv,
    });
  const { data: popularMovie, isLoading: loadingPopularMovie } =
    useApiShowsPopularRetrieve({
      media_type: ApiShowsPopularRetrieveMediaType.movie,
    });
  const isLoading =
    loadingTrendingShowsToday ||
    loadingTrendingShowsWeek ||
    loadingPopularTv ||
    loadingPopularMovie;

  return (
    <div className="flex flex-col h-full p-4 gap-8 pb-28 overflow-y-auto no-scrollbar pt-0 sm:pt-20">
      <TopPicksList
        shows={trendingShowsToday?.results?.map((show) => ({
          imgUrl: show.poster_path || "",
          id: show.id,
          mediaType: show.media_type,
          backdropUrl: show.backdrop_path || "",
          title: show.title || show.name || "",
        }))}
        isLoading={isLoading}
      />
      <AdblockBanner show={!isLoading} />
      <ContinueWatchingList />
      <HorizontalShowList
        title="Trending Today"
        shows={trendingShowsToday?.results?.map((show) => ({
          imgUrl: show.poster_path || "",
          id: show.id,
          mediaType: show.media_type,
        }))}
        isLoading={isLoading}
      />
      <HorizontalShowList
        title="Hot This Week"
        shows={trendingShowsWeek?.results?.map((show) => ({
          imgUrl: show.poster_path || "",
          id: show.id,
          mediaType: show.media_type,
        }))}
        isLoading={isLoading}
      />
      <HorizontalShowList
        title="Popular TV Shows"
        shows={popularTv?.results?.map((show) => ({
          imgUrl: show.poster_path || "",
          id: show.id,
          mediaType: show.media_type,
        }))}
        isLoading={isLoading}
      />
      <HorizontalShowList
        title="Popular Movies"
        shows={popularMovie?.results?.map((show) => ({
          imgUrl: show.poster_path || "",
          id: show.id,
          mediaType: show.media_type,
        }))}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Home;
