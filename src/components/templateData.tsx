import templateData from '@/static/templateData.json'

interface TemplateSiteData {
  browserTitle: string,
  description: string,
  headerTitle: string,
  tabs: TemplateTabConfig[],
  brochurePath: string
}

interface TemplateTabConfig {
  path: string,
  title: string,
  index?: boolean
}

export const useTemplateData = (): TemplateSiteData => {
  return templateData;
}

export const useTemplateTabConfig = (pageId: string): TemplateTabConfig => {
  const config = useTemplateData()
  const tabConfig = config.tabs.find(x => x.path === pageId)
  if (!tabConfig) {
    throw 'page not found'
  }
  return tabConfig
}