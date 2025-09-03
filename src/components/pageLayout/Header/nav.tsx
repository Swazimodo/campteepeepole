import { FC } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import { useTemplateData } from '@/components/templateData';
import { getMinWidthQuery, MediaSizes } from '@/components/mediaQueries';

interface NavProps {
  onNavigation?: (event: React.MouseEvent) => void
}

export const Nav: FC<NavProps> = (props) => {
  const config = useTemplateData()

  return <SiteNav>
    <SiteNavUl>
      {config.tabs.map(page => <SiteNavLi key={page.path}>
        <Link href={page.path} onClick={props?.onNavigation}>
          {page.title}
        </Link>
      </SiteNavLi>)}
    </SiteNavUl>
  </SiteNav>
}

const SiteNav = styled.nav`
  background-color: #4f1492;
  padding: 8px 8px;
`

const SiteNavUl = styled.ul`
  padding: 0;
  margin: 0;
`

const SiteNavLi = styled.li`
  padding: 8px 8px;
  list-style-type: none;

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