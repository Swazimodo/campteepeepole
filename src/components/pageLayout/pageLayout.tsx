import { FC } from 'react';
import styled from 'styled-components';

import Header from '@/components/pageLayout/Header';
import { Footer } from '@/components/pageLayout/footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const PageLayout: FC<LayoutProps> = (props) => {
  const { children } = props;
  return <PageDiv>
    <ContentWrapper>
      <Header />
      <ContentMain>
        {children}
      </ContentMain>
    </ContentWrapper>
    <Footer />
  </PageDiv>
}

const PageDiv = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

const ContentMain = styled.main`
  flex-grow: 1;
  max-width: 1200px;
  padding: 0 16px;
  margin: 16px auto;
`