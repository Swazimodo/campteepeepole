import siteConfig from '@/static/siteConfig.json'

interface SiteConfig {
  camp: "campTeepeePole" | "campCherith",
  awsConfig: AwsConfig,
  thumbnailPrefix: string
}

interface AwsConfig {
  bucketName: string,
  region: string,
  galleryPath: string
}

export const useSiteConfig = (): SiteConfig => {
  if (siteConfig.camp !== "campTeepeePole" && siteConfig.camp !== "campCherith") {
    console.error(`Invalid camp value in siteConfig.json: ${siteConfig.camp}`);
    siteConfig.camp = "campTeepeePole";
  }

  return siteConfig as SiteConfig;
}