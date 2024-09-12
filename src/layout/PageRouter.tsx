import { FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useSiteConfig } from 'config/useSiteConfig';
import { Page } from 'layout/page'
import { RouteNotFound } from 'pages/errorPages/notFound'
import { DynamicPage } from 'pages/configDrivenPage/dynamicPage'

export const PageRouter: FC = () => {
  const config = useSiteConfig()
  const indexPage = config.tabs.find(x => x.index) ?? config.tabs[0]
  const otherPages = config.tabs.filter(x => !x.index)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page />}>
          <Route index element={<Navigate to={`/${indexPage.path}`} replace={true} />}></Route>
          <Route path=":page" element={<DynamicPage />} />
          <Route path="*" element={<RouteNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
