import { useCallback, useEffect, useMemo, useState } from "react";

export enum MediaSizes {
  'xs' = 320,
  'sm' = 425,
  'md' = 768,
  'lg' = 1024,
  'xl' = 1280,
  'xxl' = 1440
}

export const getMinWidthQuery = (size: MediaSizes) => `(min-width: ${size}px)`
export const getMaxWidthQuery = (size: MediaSizes) => `(max-width: ${size - 0.02}px)`

export const useMediaQuery = (size: MediaSizes) => {
  const matchMediaUp = useMemo(() => window.matchMedia(`(min-width: ${size}px)`), [size])
  const matchMediaDown = useMemo(() => window.matchMedia(`(max-width: ${size - 0.02}px)`), [size])
  const [matchesUp, setMatchesUp] = useState(() => matchMediaUp.matches);
  const [matchesDown, setMatchesDown] = useState(() => matchMediaDown.matches);

  const listener = useCallback(() => {
    setMatchesUp(matchMediaUp.matches)
    setMatchesDown(matchMediaDown.matches)
  }, [matchMediaUp, setMatchesUp, matchMediaDown, setMatchesDown])
  useEffect(() => {
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [listener]);

  return {
    matchesUp,
    matchesDown
  };
};
