import { cn } from "@/lib/utils";
import BaseBarLoader from "react-spinners/BarLoader";
import { LoaderHeightWidthProps } from "react-spinners/helpers/props";

interface BarLoaderProps extends LoaderHeightWidthProps {}

export const BarLoader = (props: BarLoaderProps) => {
  return (
    <BaseBarLoader
      color="#e5e7eb"
      className={cn("bg-gray-200", props.className)}
      {...props}
    />
  );
};
