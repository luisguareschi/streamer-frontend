/* eslint-disable @next/next/no-img-element */
import { MediaTypeEnum } from "@/api/baseAppBackendAPI.schemas";
import Link from "next/link";

export interface TopPickCardProps {
  imgUrl: string;
  id: number;
  mediaType?: MediaTypeEnum;
  isLoading?: boolean;
}

export const TopPickCard = ({
  imgUrl,
  id,
  mediaType,
  isLoading,
}: TopPickCardProps) => {
  if (isLoading) {
    return (
      <div className="aspect-[2/3] w-[70vw] rounded-2xl overflow-hidden">
        <div className="w-full h-full bg-neutral-800 animate-pulse" />
      </div>
    );
  }
  return (
    <Link
      href={`/show/${id}?mediaType=${mediaType}`}
      className="aspect-[2/3] w-[70vw] rounded-2xl overflow-hidden"
    >
      <img
        src={imgUrl}
        alt={`${mediaType} ${id}`}
        className="w-full h-full object-cover active:scale-110 transition-all"
      />
    </Link>
  );
};
