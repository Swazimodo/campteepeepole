import { useMemo } from "react"
import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"
import { useSiteConfig } from "@/components/siteConfig"

export const useS3Client = () => {
  const awsConfig = useSiteConfig().awsConfig
  return new S3Client({ region: awsConfig.region })
}
