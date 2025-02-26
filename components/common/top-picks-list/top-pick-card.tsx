/* eslint-disable @next/next/no-img-element */
import { MediaTypeEnum } from "@/api/baseAppBackendAPI.schemas";
import Link from "next/link";

export interface TopPickCardProps {
  imgUrl: string;
  id: number;
  mediaType?: MediaTypeEnum;
}

export const TopPickCard = ({ imgUrl, id, mediaType }: TopPickCardProps) => {
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
