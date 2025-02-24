/* eslint-disable @next/next/no-img-element */
import { MediaTypeEnum } from "@/api/baseAppBackendAPI.schemas";
import { useRouter } from "next/navigation";

export interface ShowCardProps {
  imgUrl: string;
  mediaType: MediaTypeEnum;
  id: any;
  skeleton?: boolean;
}

export const ShowCard = ({
  imgUrl,
  id,
  mediaType,
  skeleton,
}: ShowCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/show/${id}?mediaType=${mediaType}`);
  };

  return (
    <div
      className="aspect-[2/3] min-h-32 min-w-32 rounded-lg overflow-hidden"
      onClick={handleClick}
    >
      {!skeleton && (
        <img
          src={imgUrl}
          alt="Show"
          className="w-full h-full object-cover active:scale-110 transition-all"
        />
      )}
      {skeleton && (
        <div className="w-full h-full bg-neutral-800 rounded-lg animate-pulse" />
      )}
    </div>
  );
};
