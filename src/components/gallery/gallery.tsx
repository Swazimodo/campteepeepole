import { useS3FileKeys } from "@/components/awsWrappers/s3"
import { FC } from "react"


export const Gallery: FC = async () => {
  const files = await useS3FileKeys()
  if (!files.length) {
    return null
  }
  return <div>Gallery: {JSON.stringify(files)}</div>
}
