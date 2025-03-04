"use client";
import {
  useApiShowsSearchRetrieve,
  useApiShowsTrendingRetrieve,
} from "@/api/api/api";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { VerticalShowCard } from "@/components/common/vertical-show-card";
import { BarLoader } from "@/components/common/bar-loader";
import { ApiShowsTrendingRetrieveTimeWindow } from "@/api/baseAppBackendAPI.schemas";
import dayjs from "dayjs";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: trendingShows, isLoading: isTrendingLoading } =
    useApiShowsTrendingRetrieve(
      { time_window: ApiShowsTrendingRetrieveTimeWindow.day },
      {
        query: {
          enabled: !searchQuery,
        },
      },
    );
  const { data: searchResults, isLoading: isSearchLoading } =
    useApiShowsSearchRetrieve(
      { query: searchQuery },
      { query: { enabled: !!searchQuery } },
    );

  const data = searchQuery ? searchResults : trendingShows;
  const isLoading = isTrendingLoading || isSearchLoading;

  return (
    <div className="flex flex-col px-4 gap-4 h-full pb-28 overflow-y-auto no-scrollbar sm:mt-16">
      <h1 className="hidden sm:block text-white text-2xl font-semibold text-center mb-5 mt-20">
        Search for your favorite shows
      </h1>
      <header className="sticky top-0 bg-black py-4 sm:mb-20">
        <Input
          variant="neutral"
          placeholder="Search"
          value={searchQuery}
          className="sm:w-[500px] sm:mx-auto"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </header>
      {!!data?.results.length && !isLoading && (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-8">
          {data?.results.map((result) => (
            <VerticalShowCard
              id={result.id}
              mediaType={result.media_type}
              key={result.id}
              releaseDate={
                dayjs(result.release_date || result.first_air_date).format(
                  "MMM D, YYYY",
                ) || "Unknown"
              }
              title={result.title || result.name || "Unknown Title"}
              imgUrl={result.poster_path || result.backdrop_path || ""}
              rating={String(result.vote_average.toFixed(1)) || "?/10"}
            />
          ))}
        </div>
      )}
      {isLoading && (
        <div className="flex justify-center items-center h-full w-full">
          <BarLoader className="min-w-[200px]" />
        </div>
      )}
      {!data?.results.length && !isLoading && (
        <div className="flex flex-col gap-2 justify-center items-start px-2">
          <h1 className="text-white font-semibold">
            Oops! No results for &quot;{searchQuery}&quot;
          </h1>
          <p className="text-neutral-300 text-sm flex flex-col items-center gap-2">
            Please try again with a different search term.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
