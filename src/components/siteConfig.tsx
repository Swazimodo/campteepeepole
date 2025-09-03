import siteConfig from '@/static/siteConfig.json'

interface SiteConfig {
  awsConfig: AwsConfig,
  thumbnailPrefix: string
}

interface AwsConfig {
  bucketName: string,
  region: string,
  galleryPath: string,
  brochureName: string,
}

export const useSiteConfig = (): SiteConfig => {
  return siteConfig;
}