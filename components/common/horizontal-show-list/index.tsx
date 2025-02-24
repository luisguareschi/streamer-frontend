import { MediaTypeEnum } from "@/api/baseAppBackendAPI.schemas";
import { ShowCard, ShowCardProps } from "./show-card";

interface HorizontalShowListProps {
  title: string;
  shows?: ShowCardProps[];
  isLoading?: boolean;
}

export const HorizontalShowList = ({
  title,
  shows,
  isLoading,
}: HorizontalShowListProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h1 className="text-lg text-white">{title}</h1>
      <div className="flex gap-4 overflow-x-auto no-scrollbar">
        {shows?.map((show) => <ShowCard key={show.id} {...show} />)}
      </div>
      {isLoading && (
        <div className="flex gap-4 overflow-x-auto no-scrollbar">
          {Array.from({ length: 5 }).map((_, index) => (
            <ShowCard
              key={index}
              skeleton
              imgUrl=""
              id={index}
              mediaType={MediaTypeEnum.tv}
            />
          ))}
        </div>
      )}
    </div>
  );
};
