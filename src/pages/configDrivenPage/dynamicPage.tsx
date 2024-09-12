import { FC } from "react";
import { useParams } from "react-router-dom";

import { PageProps } from 'layout/page';
import { useSiteConfig } from 'config/useSiteConfig';

const useConfigPage = () => {
  const config = useSiteConfig()
  const { page } = useParams()
  return config.tabs.find(t => t.path === page)
}

export const DynamicPage: FC<PageProps> = (props) => {
  const page = useConfigPage();
  return <>
    hello world
    {page?.title}
  </>;
}