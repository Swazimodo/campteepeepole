import { FC } from "react";
import styled from 'styled-components';
import { getMinWidthQuery, MediaSizes } from '@/components/mediaQueries';

interface BurgerButtonProps {
  onClick: () => void
}

export const BurgerButton: FC<BurgerButtonProps> = (props) => {
  return <BurgerBtn onClick={props.onClick}>burger</BurgerBtn>
}

const BurgerBtn = styled.button`
  @media ${getMinWidthQuery(MediaSizes.sm)} {
    display: none;
  }
`