/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { TopPickCard, TopPickCardProps } from "./top-pick-card";

interface TopPicksListProps {
  shows?: TopPickCardProps[];
}

export const TopPicksList = ({ shows }: TopPicksListProps) => {
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
    <div className="flex flex-col gap-10 p-4 pb-10 relative -ml-4">
      <div className="absolute top-0 left-0 w-screen h-full overflow-hidden">
        <img
          src={selectedShow?.imgUrl}
          alt={`${selectedShow?.mediaType} ${selectedShow?.id}`}
          className="w-full h-full object-cover blur-xl brightness-100 saturate-150 scale-150 z-10"
        />
        <div className="absolute top-0 left-0 w-screen h-full bg-gradient-to-t from-black to-transparent z-10" />
      </div>
      <h1 className="text-white font-medium text-2xl relative z-10">
        Streamer
      </h1>
      <div className="flex gap-4 overflow-x-auto no-scrollbar relative z-10 justify-center items-center">
        {/* {shows?.map((show) => <TopPickCard key={show.id} {...show} />)} */}
        <TopPickCard
          imgUrl={selectedShow?.imgUrl || ""}
          id={selectedShow?.id || 0}
          mediaType={selectedShow?.mediaType}
        />
      </div>
    </div>
  );
};
