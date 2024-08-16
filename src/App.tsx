import { FC } from 'react';

import 'App.css';
import { AppContextProviders } from 'common';
import { PageRouter } from 'layout/PageRouter'
import { ErrorBoundary } from 'layout/errorBoundary'

export const App: FC = () => {
  return <ErrorBoundary>
    <AppContextProviders>
      <PageRouter />
    </AppContextProviders>
  </ErrorBoundary>;
}
