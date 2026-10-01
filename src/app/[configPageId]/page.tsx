import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { Embed, Image, loadPageContent, useTemplateData, useTemplateTabConfig } from "@/components";

interface PageProps {
  params: Promise<{
    configPageId: string
  }>
}

export default async function Page(props: PageProps) {
  const pageParams = await props.params
  const tabConfig = useTemplateTabConfig(pageParams.configPageId)
  const source = await loadPageContent(tabConfig.path)
  const { default: Content } = await evaluate(source, { ...runtime, baseUrl: import.meta.url })
  return (
    <div className="flow-root">
      <Content components={{ Image, Embed }} />
    </div>
  )
}

export const dynamicParams = false

export async function generateStaticParams() {
  const templateData = useTemplateData()
  return await Promise.resolve(templateData.tabs.map(x => ({ configPageId: x.path })))
}
