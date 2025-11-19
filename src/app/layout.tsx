import type { Metadata, ResolvingMetadata } from "next";

import 'src/app/global.css'

import { PageLayout, useTemplateData } from '@/components'

type GenerateMetadataProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: GenerateMetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch config from s3
  const configFileUrl = process.env.SITE_CONFIG_JSON_URL
  // const config = await fetch(`https://.../${id}`).then((res) => res.json())

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []

  const templateData = useTemplateData()

  return {
    title: templateData.browserTitle,
    description: templateData.description,
    icons: [{
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: 'static/favicons/tpp_favicon_small.png'
    }, {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: 'static/favicons/tpp_favicon_medium.png'
    }, {
      rel: 'icon',
      type: 'image/png',
      sizes: '64x64',
      url: 'static/favicons/tpp_favicon_large.png'
    }, {
      rel: 'apple-touch-icon',
      type: 'image/png',
      sizes: '152x152',
      url: 'static/favicons/tpp_small.png'
    }, {
      rel: 'apple-touch-icon',
      type: 'image/png',
      sizes: '167x167',
      url: 'static/favicons/tpp_medium.png'
    }, {
      rel: 'apple-touch-icon',
      type: 'image/png',
      sizes: '180x180',
      url: 'static/favicons/tpp_WebLogo.png'
    }]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <PageLayout>
          {children}
        </PageLayout>
      </body>
    </html>
  )
}
