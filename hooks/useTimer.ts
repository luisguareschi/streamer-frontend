import { useEffect, useState } from "react";

interface useTimerProps {
  /**
   * The time in milliseconds between each increment of the timer
   */
  timeBetweenUpdates: number;
}

/**
 * A custom hook that creates a timer that increments at specified intervals
 * @param timeBetweenUpdates - Time in milliseconds between each increment of the timer
 * @returns The current timer value
 */

export const useTimer = ({ timeBetweenUpdates }: useTimerProps) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTime(time + 1), timeBetweenUpdates);
    return () => clearInterval(interval);
  }, [time]);

  return time;
};
