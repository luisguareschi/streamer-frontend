"use client";
import {
  useApiShowsSearchRetrieve,
  useApiShowsTrendingRetrieve,
} from "@/api/api/api";
import { Input } from "@/components/ui/input";
import { Suspense, useEffect, useRef, useState } from "react";
import { VerticalShowCard } from "@/components/common/vertical-show-card";
import { BarLoader } from "@/components/common/bar-loader";
import { ApiShowsTrendingRetrieveTimeWindow } from "@/api/baseAppBackendAPI.schemas";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const inputRef = useRef<HTMLInputElement>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Debounce the URL update to prevent losing focus on every keystroke
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearchQuery !== searchQuery) {
        const params = new URLSearchParams(searchParams);
        if (localSearchQuery) {
          params.set("search", localSearchQuery);
        } else {
          params.delete("search");
        }
        router.replace(`/search?${params.toString()}`);
      }
    }, 250); // 250ms debounce

    return () => clearTimeout(timeoutId);
  }, [localSearchQuery, router, searchParams, searchQuery]);

  // Sync the URL search param with local state when it changes externally
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

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
    <div className="flex flex-col px-4 gap-4 h-full pb-28 overflow-y-auto no-scrollbar">
      <header className="sticky top-0 bg-black py-4 sm:mb-20 sm:mt-40">
        <h1 className="hidden sm:block text-white text-2xl font-semibold text-center mb-10">
          Search for your favorite shows
        </h1>
        <Input
          ref={inputRef}
          variant="neutral"
          placeholder="Search"
          value={localSearchQuery}
          className="sm:w-[500px] sm:mx-auto"
          onChange={(e) => setLocalSearchQuery(e.target.value)}
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

const Wrapper = () => {
  return (
    <Suspense>
      <SearchPage />
    </Suspense>
  );
};

export default Wrapper;
