import { useMemo } from "react"
import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"
import { useSiteConfig } from "@/components/config"

export const useS3Client = () => {
  const awsConfig = useSiteConfig().awsConfig
  return new S3Client({
    region: "ap-northeast-1",
    // region: awsConfig.region,
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

export const useS3FileKeys = async () => {
  return await useMemo(async () => {
    try {
      const { bucketName, galleryPath } = useSiteConfig().awsConfig
      const s3Client = useS3Client()
      const command = new ListObjectsV2Command({ Bucket: bucketName, Prefix: galleryPath })
      return (await s3Client.send(command)).Contents?.map(x => x.Key).filter(x => !!x) as string[]
    }
    catch (ex) {
      console.error(ex)
    }
    return []
  }, [])
}

