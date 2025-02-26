// hooks/useOverwriteBackGesture.ts
"use client"; // Mark this as a Client Component

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export const useOverwriteBackGesture = (callback?: () => void) => {
  const pathname = usePathname();

  useEffect(() => {
    const enabled = true;

    if (enabled) {
      // Disable the back gesture by manipulating the history
      window.history.pushState(null, "", window.location.href);
      window.history.pushState(null, "", window.location.href);
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = () => {
        window.history.pushState(null, "", window.location.href);
        window.history.pushState(null, "", window.location.href);
        window.history.pushState(null, "", window.location.href);
      };
    } else {
      // Re-enable the back gesture for other routes
      window.onpopstate = null;
    }

    // Cleanup
    return () => {
      window.onpopstate = null;
    };
  }, [pathname]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Call the callback function when the back gesture is detected
      callback?.();
    };

    // Add event listener for the popstate event
    window.addEventListener("popstate", handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pathname, callback]);
};
