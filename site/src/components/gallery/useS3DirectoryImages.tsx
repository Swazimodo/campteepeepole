import { useEffect, useState } from "react"
import { useSiteConfig } from "@/components/siteConfig"

export interface S3Image {
  url: string,
  thumbUrl?: string,
  alt: string,
}

/**
 * Lists images from a directory in AWS S3 from the browser. Images will be matched up with the thumbnail if available.
 * The bucket, or the CDN in front of it, must allow public listing and CORS.
 * @param path S3 directory to pull images from
 */
export const useS3DirectoryImages = (path: string) => {
  const { awsConfig, thumbnailPrefix } = useSiteConfig()
  const galleryUrl = process.env.NEXT_PUBLIC_GALLERY_URL ?? `https://${awsConfig.bucketName}.s3.${awsConfig.region}.amazonaws.com`
  const [images, setImages] = useState<S3Image[]>([])

  useEffect(() => {
    let ignore = false
    listKeys(galleryUrl, path)
      .then(keys => {
        if (ignore)
          return
        setImages(Object.values(keys
          .filter(isImageFileType)                                                                   // filter out files that are not jpg, png, or svg
          .reduce<{ [key: string]: S3Image }>(groupImagesAndThumbnails(galleryUrl, thumbnailPrefix), {}))  // group images and thumbnails
          .filter(x => !!x.url))                                                                     // filter out thumbnails without a full sized image
      })
      .catch(ex => console.error(ex))
    return () => { ignore = true }
  }, [galleryUrl, path, thumbnailPrefix])

  return images
}

/**
 * Lists the keys of non-empty objects under `prefix` with the S3 ListObjectsV2 REST API, following continuation tokens.
 */
const listKeys = async (galleryUrl: string, prefix: string) => {
  const keys: string[] = []
  let continuationToken: string | undefined
  do {
    const query = new URLSearchParams({ "list-type": "2", prefix })
    if (continuationToken)
      query.set("continuation-token", continuationToken)

    const response = await fetch(`${galleryUrl}/?${query}`)
    if (!response.ok)
      throw new Error(`Listing ${galleryUrl} failed with ${response.status}`)

    const xml = new DOMParser().parseFromString(await response.text(), "application/xml")
    for (const content of Array.from(xml.getElementsByTagName("Contents"))) {
      const key = content.getElementsByTagName("Key")[0]?.textContent
      const size = Number(content.getElementsByTagName("Size")[0]?.textContent)
      if (key && size > 0)
        keys.push(key)
    }
    continuationToken = xml.getElementsByTagName("NextContinuationToken")[0]?.textContent ?? undefined
  } while (continuationToken)
  return keys
}

/**
 * checks if the filename ends in a supported image type: jpg, png, or svg
 */
const isImageFileType = (fileName?: string) => {
  return ['.jpg', '.png', '.svg'].some(extension => fileName?.endsWith(extension))
}

/**
 * Groups full sized images with the thumbnails. Thumbnails are identified by a name starting with `thumb_`
 */
const groupImagesAndThumbnails = (galleryUrl: string, thumbnailPrefix: string) => (accumulator: { [key: string]: S3Image }, currentValue?: string): { [key: string]: S3Image } => {
  if (!currentValue)
    return accumulator

  const fileName = currentValue.substring(currentValue.lastIndexOf('/') + 1)
  const isThumb = fileName.startsWith(thumbnailPrefix)
  const keyName = isThumb ? fileName.substring(thumbnailPrefix.length) : fileName

  let entry = accumulator[keyName]
  if (!entry) {
    entry = {
      url: "",
      thumbUrl: undefined,
      alt: keyName
    }
    accumulator[keyName] = entry
  }

  if (isThumb) {
    entry.thumbUrl = `${galleryUrl}/${currentValue}`
  } else {
    entry.url = `${galleryUrl}/${currentValue}`
  }

  return accumulator
}
