import { Info, Link as LinkIcon } from "lucide-react";
import { useDetectAdBlock } from "adblock-detect-react";
import Link from "next/link";
import { usePlatform } from "@/hooks/usePlatform";

interface AdblockBannerProps {
  show?: boolean;
}

export const AdblockBanner = ({ show = true }: AdblockBannerProps) => {
  const { isIOS, isAndroid } = usePlatform();
  const hasAdblocker = useDetectAdBlock();
  const adGuardLink =
    "https://apps.apple.com/us/app/adguard-adblock-privacy/id1047223162";
  const adBlockPlusLink = "https://adblockplus.org/";

  if (!show || hasAdblocker) return null;

  return (
    <div className="w-full rounded-xl bg-gray-800/50 p-4 flex items-center gap-4 border border-gray-600 sm:w-fit">
      <Info className="size-6 min-w-6 min-h-6 text-gray-100" />
      <div>
        <h1 className="text-gray-100 font-medium">Adblocker not detected</h1>
        <p className="text-gray-300">
          For a better experience, please enable an Adblocker on your browser.
        </p>
        {isIOS && (
          <Link
            href={adGuardLink}
            target="_blank"
            className="flex items-center gap-2 mt-2 text-blue-500"
          >
            <LinkIcon className="size-4 min-w-4 min-h-4" />
            Install AdGuard for iOS
          </Link>
        )}
        {!isIOS && !isAndroid && (
          <Link
            href={adBlockPlusLink}
            target="_blank"
            className="flex items-center gap-2 mt-2 text-blue-500"
          >
            <LinkIcon className="size-4 min-w-4 min-h-4" />
            Install AdBlockPlus
          </Link>
        )}
      </div>
    </div>
  );
};
