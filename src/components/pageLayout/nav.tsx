import { FC } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import { useSiteConfig } from '@/components/config';

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
`

const SiteNavLi = styled.li`
  display: inline-block;
  padding: 0 8px;

  a:link,
  a:visited,
  a:hover,
  a:active {
    color: orange;
  }
`