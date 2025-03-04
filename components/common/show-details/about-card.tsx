import { MovieDetail } from "@/api/baseAppBackendAPI.schemas";
import { TvDetail } from "@/api/baseAppBackendAPI.schemas";
import { EpisodeDrawer } from "@/components/common/show-details/episode-drawer";
import { Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";

interface AboutCardProps {
  title: string;
  description: string;
  rating: number;
  releaseDate: string;
  genres: string[];
  data: string;
  tv?: TvDetail;
  movie?: MovieDetail;
}

export const AboutCard = ({
  title,
  description,
  rating,
  releaseDate,
  genres,
  data,
  tv,
  movie,
}: AboutCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const element = textRef.current;
      setIsOverflowing(element.scrollHeight > element.clientHeight);
    }
  }, [description]);

  return (
    <div
      className="flex flex-col gap-2 z-10 bg-neutral-200/30 backdrop-blur-md p-6 rounded-3xl sm:max-w-lg sm:p-10 
    sm:min-w-[512px]"
    >
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre, index) => (
          <p key={genre} className="text-white">
            {genre}
            {index !== genres.length - 1 && ", "}
          </p>
        ))}
      </div>
      <div className="flex gap-2 justify-start items-center text-white font-light text-sm">
        <div className="flex gap-1 justify-center items-center">
          <Star className="w-4 h-4 mb-[2px] text-yellow-500" fill="#eab308 " />
          <p className="">{rating.toFixed(1)}</p>
        </div>
        <p className="">•</p>
        <p className="">{dayjs(releaseDate).format("MMM D, YYYY")}</p>
        <p className="">•</p>
        <p className="">{data}</p>
      </div>
      <div>
        <p
          ref={textRef}
          className={`text-white leading-normal text-sm transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-[1000px]" : "max-h-[80px] line-clamp-4"
          }`}
        >
          {description}
        </p>
        {isOverflowing && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white text-sm transition-colors mt-1"
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
      <EpisodeDrawer tv={tv} movie={movie} />
    </div>
  );
};
