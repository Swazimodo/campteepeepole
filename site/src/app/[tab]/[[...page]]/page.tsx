import { Embed, Image, listPages, loadPage } from "@/components";

interface PageProps {
  params: Promise<{
    tab: string
    page?: string[]
  }>
}

export default async function Page(props: PageProps) {
  const { tab, page } = await props.params
  const { default: Content } = await loadPage(tab, page?.[0])
  return (
    <div className="flow-root">
      <Content components={{ Image, Embed }} />
    </div>
  )
}

export const dynamicParams = false

export const generateStaticParams = listPages
