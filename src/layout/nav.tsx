import { FC } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components'

export const Nav: FC = () => {
  return <SiteNav>
    <ul>
      <li><Link to="table">Resource Table</Link></li>
      <li><Link to="pattern">Pattern Builder</Link></li>
      <li><Link to="TODO">TODO</Link></li>
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
