'use client'

import { Fragment } from "react";
import styled from "styled-components";

import 'src/app/global.css'

import { Header, Footer, Nav, getMaxWidthQuery, MediaSizes } from '@/components'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Fragment>
    <Header />
    <Nav />
    <PageDiv className='App'>
      <ContentMain>
        {children}
      </ContentMain>
    </PageDiv>
    <Footer />
  </Fragment>
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