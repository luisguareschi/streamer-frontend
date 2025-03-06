import { ChevronLeft, Heart, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import {
  useApiWatchlistCreate,
  useApiWatchlistIsInWatchlistCreate,
} from "@/api/api/api";
import { MediaTypeEnum } from "@/api/baseAppBackendAPI.schemas";
import { MovieDetail, TvDetail } from "@/api/baseAppBackendAPI.schemas";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface HeaderProps {
  show?: TvDetail | MovieDetail;
  mediaType: MediaTypeEnum;
}

export const Header = ({ show, mediaType }: HeaderProps) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const router = useRouter();
  const { mutate: checkIsInWatchlist } = useApiWatchlistIsInWatchlistCreate({
    mutation: {
      onSuccess: (data) => {
        setIsInWatchlist(data.is_in_watchlist);
      },
    },
  });

  const { mutate: saveToWatchlist } = useApiWatchlistCreate({
    mutation: {
      onSuccess: () => {
        checkIsInWatchlist({
          data: {
            tmdb_id: show?.id || 0,
          },
        });
      },
    },
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };
  const handleAddToWatchList = () => {
    const showTitle =
      mediaType === MediaTypeEnum.tv
        ? (show as TvDetail)?.name
        : (show as MovieDetail)?.title || "";

    saveToWatchlist({
      data: {
        backdrop_path: show?.backdrop_path || "",
        poster_path: show?.poster_path || "",
        title: showTitle,
        tmdb_id: show?.id || 0,
        media_type: mediaType,
      },
    });
  };

  useEffect(() => {
    if (!show) return;
    checkIsInWatchlist({
      data: {
        tmdb_id: show?.id || 0,
      },
    });
  }, [show]);

  return (
    <div className="flex justify-between items-start sm:fixed sm:top-0 sm:left-0 sm:w-full sm:p-4">
      <Button variant="glass" size="icon" onClick={() => router.back()}>
        <ChevronLeft className="size-6 min-w-6 min-h-6 drop-shadow-lg" />
      </Button>
      <div className="flex flex-col gap-3">
        <Button variant="glass" size="icon" onClick={handleAddToWatchList}>
          <Heart
            className="size-6 min-w-6 min-h-6 drop-shadow-lg"
            fill={isInWatchlist ? "currentColor" : "none"}
          />
        </Button>
        <Button variant="glass" size="icon" onClick={handleShare}>
          <Share2 className="size-6 min-w-6 min-h-6 drop-shadow-lg" />
        </Button>
      </div>
    </div>
  );
};
