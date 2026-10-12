import { useCallback, useEffect, useState } from "react"
import { S3Image } from "@/components/gallery/useS3DirectoryImages"

interface ImageWindowOptions {
  /** Thumbnails to load from the current index onward. Loaded thumbnails stay loaded. */
  thumbnailCount: number,
  /** Full sized images to preload from the current index onward. 0 loads full images only on demand. */
  fullCount: number,
}

export interface WindowedImage extends S3Image {
  /** Set once the thumbnail is paged in. Uses the full image when there is no thumbnail. */
  thumbSrc?: string,
  /** Set while the full image is in the preload window or was requested with `loadFull`. */
  fullSrc?: string,
}

/**
 * Decides which thumbnails and full sized images to load for the image at `index`.
 * Full images in the window are preloaded so the view can show them without waiting.
 */
export const useImageWindow = (images: S3Image[], index: number, { thumbnailCount, fullCount }: ImageWindowOptions) => {
  const thumbEnd = Math.min(images.length, index + thumbnailCount)
  const [loadedThumbEnd, setLoadedThumbEnd] = useState(thumbEnd)
  if (thumbEnd > loadedThumbEnd)
    setLoadedThumbEnd(thumbEnd)

  const [requested, setRequested] = useState<ReadonlySet<number>>(new Set())
  const loadFull = useCallback((i: number) => setRequested(prev => prev.has(i) ? prev : new Set(prev).add(i)), [])

  const isFullInWindow = (i: number) => i >= index && i < index + fullCount

  const windowUrls = images.slice(index, index + fullCount).map(x => x.url).join("\n")
  useEffect(() => {
    if (windowUrls)
      windowUrls.split("\n").forEach(url => { new Image().src = url })
  }, [windowUrls])

  const items: WindowedImage[] = images.map((image, i) => ({
    ...image,
    thumbSrc: i < Math.max(loadedThumbEnd, thumbEnd) ? image.thumbUrl ?? image.url : undefined,
    fullSrc: isFullInWindow(i) || requested.has(i) ? image.url : undefined,
  }))

  return { items, loadFull }
}
