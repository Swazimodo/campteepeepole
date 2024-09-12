import siteConfig from 'config/siteContent.json'

interface SiteConfig {
  browserTitle: string,
  headerTitle: string,
  tabs: SiteTabConfig[]
}

interface SiteTabConfig {
  path: string,
  title: string,
  index?: boolean
}

export const useSiteConfig = (): SiteConfig => {
  return siteConfig;
}