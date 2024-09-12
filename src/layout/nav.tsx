import { FC } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components'

import { useSiteConfig } from 'config/useSiteConfig';

export const Nav: FC = () => {
  const config = useSiteConfig()
  return <SiteNav>
    <ul>
      {config.tabs.map(page =>
        <li key={page.path}><Link to={page.path}>{page.title}</Link></li>)}
    </ul>
  </SiteNav>
}

const SiteNav = styled.nav`
  background-color: #4f1492;

  ul {
    padding: 0;
  }

  li {
    display: inline-block;
    padding: 0 8px;
  }

  a:link,
  a:visited,
  a:hover,
  a:active {
    color: orange;
  }
`
