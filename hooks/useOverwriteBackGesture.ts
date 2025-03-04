// hooks/useOverwriteBackGesture.ts
"use client"; // Mark this as a Client Component

import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface UseOverwriteBackGestureProps {
  callback?: () => void;
  enabled?: boolean;
  timesToPushState?: number;
}

/**
 * A hook that overrides the browser's back gesture/button behavior.
 *
 * This hook manipulates the browser history to prevent users from navigating back using gestures or the back button.
 * Instead, it executes a custom callback function when a back navigation is attempted.
 *
 * @param  props - The hook's configuration options
 * @param props.callback - Function to execute when back navigation is attempted
 * @param props.enabled - Whether the back gesture override is enabled (default: true)
 * @param props.timesToPushState - Number of history states to push to prevent back navigation (default: 3)
 *
 * @example
 * useOverwriteBackGesture({
 *   callback: () => router.push('/home'),
 *   enabled: true
 *   timesToPushState: 3
 * });
 */

export const useOverwriteBackGesture = ({
  callback,
  enabled = true,
  timesToPushState = 3,
}: UseOverwriteBackGestureProps) => {
  const pathname = usePathname();

  useEffect(() => {
    if (enabled) {
      // Disable the back gesture by manipulating the history
      for (let i = 0; i < timesToPushState; i++) {
        window.history.pushState(null, "", window.location.href);
      }
      window.onpopstate = () => {
        for (let i = 0; i < timesToPushState; i++) {
          window.history.pushState(null, "", window.location.href);
        }
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
