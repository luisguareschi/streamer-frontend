import { MediaTypeEnum } from "@/api/baseAppBackendAPI.schemas";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
/* eslint-disable @next/next/no-img-element */
interface VerticalShowCard {
  releaseDate: string;
  title: string;
  imgUrl: string;
  rating: string;
  id: number;
  mediaType: MediaTypeEnum;
}

export const VerticalShowCard = ({
  releaseDate,
  title,
  imgUrl,
  rating,
  id,
  mediaType,
}: VerticalShowCard) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/show/${id}?mediaType=${mediaType}`);
  };

  return (
    <div className="flex flex-col gap-2 mb-2" onClick={handleClick}>
      <img
        src={imgUrl}
        alt={title}
        className="aspect-[2/3] w-full object-cover rounded-xl shadow-inner active:scale-110 active:brightness-110 transition-all"
      />
      <div className="flex flex-col gap-1">
        <p className="text-sm text-neutral-400 font-light">{releaseDate}</p>
        <h3 className="text-white text-sm line-clamp-1">{title}</h3>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500 mb-[3px]" fill="#eab308" />
          <p className="text-sm text-neutral-400">{rating}</p>
        </div>
      </div>
    </div>
  );
};
