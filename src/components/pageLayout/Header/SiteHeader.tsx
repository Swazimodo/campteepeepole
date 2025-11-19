import { FC } from 'react';
import { BurgerButton } from '@/components/pageLayout/Header/burgerButton';
interface SiteHeaderProps {
  onMenuClick: (event: React.MouseEvent) => void
}

export const SiteHeader: FC<SiteHeaderProps> = (props) => {
  return <header className='h-10 bg-blue-800 flex flex-row justify-between'>
    <div>header</div>
    <BurgerButton onClick={props.onMenuClick} />
  </header>
}
