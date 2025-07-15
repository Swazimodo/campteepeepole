import { FC } from "react"
import { useS3DirectoryImages } from "@/components/awsWrappers/s3"
import { useSiteConfig } from "@/components/config"


export const Gallery: FC = async () => {
  const { galleryPath } = useSiteConfig().awsConfig
  const files = await useS3DirectoryImages(galleryPath)
  if (!files.length) {
    return null
  }
  return <div>
    Gallery:
    {files.map(file => <div key={file.url}>
      <img src={file.url} alt={file.alt} />
    </div>)}
  </div>
}
