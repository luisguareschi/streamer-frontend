/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { TopPickCard, TopPickCardProps } from "./top-pick-card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Link from "next/link";

interface TopPicksListProps {
  shows?: TopPickCardProps[];
  isLoading?: boolean;
}

export const TopPicksList = ({ shows, isLoading }: TopPicksListProps) => {
  const isMobile = useIsMobile();
  const [selectedShow, setSelectedShow] = useState<TopPickCardProps | null>(
    null,
  );

  useEffect(() => {
    if (shows) {
      // get random show
      const randomShow = shows[Math.floor(Math.random() * shows.length)];
      setSelectedShow(randomShow);
    }
  }, [shows]);

  return (
    <div className="flex flex-col gap-10 p-4 pb-10 relative -ml-4 sm:-mt-20 sm:min-h-[60vh]">
      {!isLoading && (
        <div className="absolute top-0 left-0 w-screen h-full overflow-hidden">
          <img
            src={isMobile ? selectedShow?.imgUrl : selectedShow?.backdropUrl}
            alt={`${selectedShow?.mediaType} ${selectedShow?.id}`}
            className="w-full h-full object-cover blur-xl brightness-100 saturate-150 scale-150 z-10 
            sm:blur-none sm:object-contain sm:relative sm:z-[1] sm:mt-20"
          />
          <img
            src={selectedShow?.backdropUrl}
            alt={`${selectedShow?.mediaType} ${selectedShow?.id}`}
            className="hidden sm:block absolute top-0 left-0 w-full h-full object-cover blur-xl brightness-100 saturate-150 scale-150 z-[0]"
          />
          <div className="absolute top-0 left-0 w-screen h-full bg-gradient-to-t from-black to-transparent z-10" />
        </div>
      )}
      <div className="flex-col gap-12 h-full justify-end items-stat hidden sm:flex mb-10 z-[10] relative">
        <h1 className="text-white font-medium text-7xl">
          {selectedShow?.title}
        </h1>
        <Link
          href={`/show/${selectedShow?.id}?mediaType=${selectedShow?.mediaType}`}
        >
          <Button variant="roundedWhite" size="xl" className="">
            <Play className="min-w-6 min-h-6" fill="currentColor" />
            Watch Now
          </Button>
        </Link>
      </div>
      <h1 className="text-white font-medium text-2xl relative z-10 sm:hidden">
        Streamer
      </h1>
      <div className="flex gap-4 overflow-x-auto no-scrollbar relative z-10 justify-center items-center sm:hidden">
        {/* {shows?.map((show) => <TopPickCard key={show.id} {...show} />)} */}
        <TopPickCard
          imgUrl={selectedShow?.imgUrl || ""}
          id={selectedShow?.id || 0}
          mediaType={selectedShow?.mediaType}
          isLoading={isLoading}
          backdropUrl={selectedShow?.backdropUrl || ""}
          title={selectedShow?.title || ""}
        />
      </div>
    </div>
  );
};
