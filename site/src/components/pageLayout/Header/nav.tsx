import { FC } from 'react';
import Link from 'next/link';

import type { Tab } from '@/components/pageContent';

interface NavProps {
  tabs: Tab[]
  onNavigation?: (event: React.MouseEvent) => void
}

export const Nav: FC<NavProps> = (props) => {
  return <nav className='bg-purple-900 p-2'>
    <ul className='m-0 p-0'>
      {props.tabs.map(page => <li key={page.path} className='p-2 list-none text-orange-400 sm:inline-block'>
        <Link href={`/${page.path}`} onClick={props?.onNavigation}>
          {page.title}
        </Link>
      </li>)}
    </ul>
  </nav>
}
