import { FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Page } from 'layout/page'
import { ResourceTable } from 'pages/resourceTable/table'
import { PatternBuilder } from 'pages/patternBuilder'
import { RouteNotFound } from 'pages/errorPages/notFound'

export const PageRouter: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page />}>
          <Route index element={<Navigate to="/table" replace={true} />}></Route>
          <Route path="table" element={<ResourceTable />} />
          <Route path="pattern" element={<PatternBuilder />} />
          <Route path="*" element={<RouteNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
