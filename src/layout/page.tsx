import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components'

import { Header } from 'layout/header'
import { Nav } from 'layout/nav'
import { Footer } from 'layout/footer'
import { MediaSizes, getMaxWidthQuery, ToastMessageEmitter } from 'common';


interface PageProps {
  children?: React.ReactNode
}

export const Page: FC<PageProps> = (props) => {
  return <>
    <ToastMessageEmitter />
    <PageDiv className='App'>
      <Header />
      <Nav />
      <ContentMain>
        <Outlet />
      </ContentMain>
      <Footer />
    </PageDiv>
  </>
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
