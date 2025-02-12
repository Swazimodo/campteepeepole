'use client'

import { useCallback, useEffect, useState } from "react";
import { useClientSideMemo } from "@/components/clientSideMemoHook";

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
  const matchMediaUp = useClientSideMemo(() => window.matchMedia(`(min-width: ${size}px)`), [size])
  const matchMediaDown = useClientSideMemo(() => window.matchMedia(`(max-width: ${size - 0.02}px)`), [size])
  const [windowGreaterThan, setMatchesUp] = useState(() => matchMediaUp !== null ? matchMediaUp.matches : false);
  const [windowLessThan, setMatchesDown] = useState(() => matchMediaDown !== null ? matchMediaDown.matches : false);

  const handleResize = useCallback(() => {
    if (matchMediaUp === null || matchMediaDown === null) {
      return
    }
    setMatchesUp(matchMediaUp.matches)
    setMatchesDown(matchMediaDown.matches)
  }, [matchMediaUp, setMatchesUp, matchMediaDown, setMatchesDown])
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return {
    windowGreaterThan,
    windowLessThan
  };
};