import { useSiteConfig, useTabConfig } from "@/components";

interface PageProps {
  params: {
    configPageId: string
  }
}

export default function Page(props: PageProps) {
  const config = useTabConfig(props.params.configPageId)
  return <h1>Hello, {config.title} Page!</h1>
}

export async function generateStaticParams() {
  const config = useSiteConfig()
  return Promise.resolve(config.tabs.map(x => ({ configPageId: x.path })))
}
