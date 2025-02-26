"use client";

import { useEffect, useState } from "react";

interface PlatformInfo {
  isPWA: boolean;
  isAndroid: boolean;
  isIOS: boolean;
}

export const usePlatform = (): PlatformInfo => {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>({
    isPWA: false,
    isAndroid: false,
    isIOS: false,
  });

  useEffect(() => {
    const detectPlatform = () => {
      // Check if running as PWA
      const isPWA =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes("android-app://");

      // Detect OS
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isAndroid = /android/.test(userAgent);
      const isIOS = /iphone|ipad|ipod/.test(userAgent);

      setPlatformInfo({
        isPWA,
        isAndroid,
        isIOS,
      });
    };

    detectPlatform();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleChange = (e: MediaQueryListEvent) => {
      setPlatformInfo((prev) => ({
        ...prev,
        isPWA: e.matches,
      }));
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return platformInfo;
};
