import { ChevronLeft, Plus, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const router = useRouter();
  return (
    <div className="flex justify-between items-start sm:fixed sm:top-0 sm:left-0 sm:w-full sm:p-4">
      <Button
        variant="glass"
        size="icon"
        className="bg-transparent backdrop-blur-none"
        onClick={() => router.back()}
      >
        <ChevronLeft className="size-6 min-w-6 min-h-6" />
      </Button>
      <div className="flex flex-col gap-3">
        <Button variant="glass" size="icon">
          <Plus className="size-6 min-w-6 min-h-6" />
        </Button>
        <Button variant="glass" size="icon">
          <Share2 className="size-6 min-w-6 min-h-6" />
        </Button>
      </div>
    </div>
  );
};
