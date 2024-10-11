import { useMemo, useRef } from 'react'
import siteConfig from '@/static/config.json'

interface SiteConfig {
  browserTitle: string,
  description: string,
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

export const useTabConfig = (pageId: string): SiteTabConfig => {
  const config = useSiteConfig()
  const tabConfig = config.tabs.find(x => x.path === pageId)
  if (!tabConfig) {
    throw 'page not found'
  }
  return tabConfig
}