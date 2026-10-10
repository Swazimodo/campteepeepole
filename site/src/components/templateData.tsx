import templateData from '@/static/templateData.json'

interface TemplateSiteData {
  browserTitle: string,
  description: string,
  headerTitle: string,
  brochurePath: string
}

export const useTemplateData = (): TemplateSiteData => {
  return templateData;
}
