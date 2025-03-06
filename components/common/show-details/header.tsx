import { ChevronLeft, Plus, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export const Header = () => {
  const router = useRouter();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="flex justify-between items-start sm:fixed sm:top-0 sm:left-0 sm:w-full sm:p-4">
      <Button variant="glass" size="icon" onClick={() => router.back()}>
        <ChevronLeft className="size-6 min-w-6 min-h-6 drop-shadow-lg" />
      </Button>
      <div className="flex flex-col gap-3">
        <Button variant="glass" size="icon">
          <Plus className="size-6 min-w-6 min-h-6 drop-shadow-lg" />
        </Button>
        <Button variant="glass" size="icon" onClick={handleShare}>
          <Share2 className="size-6 min-w-6 min-h-6 drop-shadow-lg" />
        </Button>
      </div>
    </div>
  );
};
