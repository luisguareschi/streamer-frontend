/* eslint-disable @next/next/no-img-element */
import Icon from "@/assets/iTunesArtwork@2x.png";
import { cn } from "@/lib/utils";

interface AppIconProps {
  className?: string;
}

export const AppIcon = ({ className }: AppIconProps) => {
  return (
    <img
      src={Icon.src}
      alt="App Icon"
      className={cn("size-20 rounded-xl", className)}
    />
  );
};
