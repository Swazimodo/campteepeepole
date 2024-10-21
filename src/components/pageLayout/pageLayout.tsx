import { FC } from 'react';
import styled from 'styled-components';

import { getMaxWidthQuery, MediaSizes } from '@/components/mediaQueries';
import { Header } from '@/components/pageLayout/header';
import { Footer } from '@/components/pageLayout/footer';
import { Nav } from '@/components/pageLayout/nav';

interface LayoutProps {
  children: React.ReactNode;
}

export const PageLayout: FC<LayoutProps> = (props) => {
  const { children } = props;
  return <PageDiv className='App'>
    <Header />
    <Nav />
    <ContentMain>
      {children}
    </ContentMain>
    <Footer />
  </PageDiv>
}

const PageDiv = styled.div`
  display: flex;
  flex-direction: column;

  > div {
    padding: 8px;
  }
`

const ContentMain = styled.main`
  flex-grow: 1;
  max-width: 1200px;
  margin: 16px auto;

  @media ${getMaxWidthQuery(MediaSizes.sm)} {
    width: 100%;
  }
`