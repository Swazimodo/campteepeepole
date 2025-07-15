import { useMemo } from "react"
import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"
import { useSiteConfig } from "@/components/config"

export const useS3Client = () => {
  const awsConfig = useSiteConfig().awsConfig
  return new S3Client({
    region: awsConfig.region,
    credentials: {
      secretAccessKey: "MOCK",
      accessKeyId: "MOCK",
    },
    signer: {
      async sign(req) {
        return req;
      }
    }
  })
}

interface S3Image {
  url: string,
  thumbUrl?: string,
  alt: string,
}

/**
 * Lists images from a directory in AWS S3. Images will be matched up with the thumbnail if available.
 * @param path S3 directory to pull images from
 */
export const useS3DirectoryImages = async (path: string) => {
  const { bucketName } = useSiteConfig().awsConfig
  const s3Client = useS3Client()
  return await useMemo(async () => {
    try {
      const command = new ListObjectsV2Command({ Bucket: bucketName, Prefix: path })
      return Object.values((await s3Client.send(command)).Contents
        ?.filter(x => !!x.Key && !!x.Size && x.Size > 0)                                  // filter out invalid files
        .map(x => x.Key)                                                                  // keep only the file keys
        .reduce<{ [key: string]: S3Image }>(reduceImageList(bucketName), {}) ?? {})        // group images and thumbnails
        .filter(x => !!x.url)                                                             // filter out thumbnails without a full sized image
    }
    catch (ex) {
      console.error(ex)
    }
    return []
  }, [path])
}

/**
 * Groups full sized images with the thumbnails. Thumbnails are identified by a name starting with `thumb_`
 */
const reduceImageList = (bucketName: string) => (accumulator: { [key: string]: S3Image }, currentValue?: string): { [key: string]: S3Image } => {
  if (!currentValue)
    return accumulator

  const fileName = currentValue.substring(currentValue.lastIndexOf('/') + 1)
  const isThumb = fileName.startsWith('thumb_')
  const keyName = isThumb ? fileName : fileName

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
    entry.thumbUrl = `https://${bucketName}.s3.amazonaws.com/${currentValue}`
  } else {
    entry.url = `https://${bucketName}.s3.amazonaws.com/${currentValue}`
  }

  return accumulator
}
