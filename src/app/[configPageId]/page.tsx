import { useSiteConfig, useTabConfig } from "@/components";

interface PageProps {
  params: Promise<{
    configPageId: string
  }>
}

export default async function Page(props: PageProps) {
  const pageParams = await props.params
  const config = useTabConfig(pageParams.configPageId)
  return <h1>Hello, {config.title} Page!</h1>
}

export async function generateStaticParams() {
  const config = useSiteConfig()
  return await Promise.resolve(config.tabs.map(x => ({ configPageId: x.path })))
}
