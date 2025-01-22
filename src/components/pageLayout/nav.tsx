import { FC } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import { useSiteConfig } from '@/components/config';
import { getMinWidthQuery, MediaSizes } from '@/components/mediaQueries';

export const Nav: FC = () => {
  const config = useSiteConfig()

  return <SiteNav>
    <SiteNavUl>
      {config.tabs.map(page => <SiteNavLi key={page.path}>
        <Link href={page.path}>
          {page.title}
        </Link>
      </SiteNavLi>)}
    </SiteNavUl>
  </SiteNav>
}

const SiteNav = styled.nav`
  background-color: #4f1492;
`

const SiteNavUl = styled.ul`
  padding: 0;
  margin: 8px 8px;
`

const SiteNavLi = styled.li`
  padding: 8px 8px;

  a:link,
  a:visited,
  a:hover,
  a:active {
    color: orange;
  }

  @media ${getMinWidthQuery(MediaSizes.sm)} {
    display: inline-block;
  }
`