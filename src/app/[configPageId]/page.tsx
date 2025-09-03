import { useTemplateData, useTemplateTabConfig } from "@/components";

interface PageProps {
  params: Promise<{
    configPageId: string
  }>
}

export default async function Page(props: PageProps) {
  const pageParams = await props.params
  const tabConfig = useTemplateTabConfig(pageParams.configPageId)
  return <h1>Hello, {tabConfig.title} Page!</h1>
}

export async function generateStaticParams() {
  const templateData = useTemplateData()
  return await Promise.resolve(templateData.tabs.map(x => ({ configPageId: x.path })))
}
