import { Metadata } from "next";
import {
  MediaTypeEnum,
  MovieDetail,
  TvDetail,
} from "@/api/baseAppBackendAPI.schemas";

type Props = {
  params: { id: string };
  searchParams: { mediaType: MediaTypeEnum };
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  // Fetch data
  const mediaType = searchParams?.mediaType;
  const endpoint =
    mediaType === MediaTypeEnum.movie
      ? `/shows/movie/${params.id}`
      : `/shows/tv/${params.id}`;

  try {
    const data: MovieDetail | TvDetail = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    ).then((res) => res.json());

    // @ts-ignore
    const title = mediaType === MediaTypeEnum.movie ? data.title : data.name;

    return {
      title: title,
      description: data.overview,
      openGraph: {
        title: title,
        description: data.overview,
        images: [
          {
            url: data.poster_path || "",
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: data.overview,
        images: [data.poster_path || ""],
      },
    };
  } catch (e) {
    return {
      title: "Show Details",
      description: "View show details",
    };
  }
}

export default function ShowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
