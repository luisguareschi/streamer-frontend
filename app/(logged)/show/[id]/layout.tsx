import { Metadata } from "next";
import { MediaTypeEnum } from "@/api/baseAppBackendAPI.schemas";

// Update the type definition to match Next.js expectations
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  // Get mediaType from searchParams and validate it
  const mediaType = searchParams.mediaType as MediaTypeEnum;

  if (!mediaType || !Object.values(MediaTypeEnum).includes(mediaType)) {
    return {
      title: "Show Details",
      description: "View show details",
    };
  }

  const endpoint =
    mediaType === MediaTypeEnum.movie
      ? `/api/shows/movie/${params.id}`
      : `/api/shows/tv/${params.id}`;

  try {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    ).then((res) => res.json());

    return {
      title: data.title || data.name,
      description: data.overview,
      openGraph: {
        title: data.title || data.name,
        description: data.overview,
        images: [
          {
            url: data.backdrop_path,
            width: 1200,
            height: 630,
            alt: data.title || data.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: data.title || data.name,
        description: data.overview,
        images: [data.backdrop_path],
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
