import { FC } from 'react';
import styled from 'styled-components'
import { BurgerButton } from '@/components/pageLayout/Header/burgerButton';
interface SiteHeaderProps {
  onMenuClick: () => void
}

export const SiteHeader: FC<SiteHeaderProps> = (props) => {
  return <SiteHeaderHeader>
    <div>header</div>
    <BurgerButton onClick={props.onMenuClick} />
  </SiteHeaderHeader>
}

const SiteHeaderHeader = styled.header`
  height: 40px;
  background-color: #3f41c9;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`