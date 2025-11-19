import { FC } from 'react';

import Header from '@/components/pageLayout/Header';
import { Footer } from '@/components/pageLayout/footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const PageLayout: FC<LayoutProps> = (props) => {
  const { children } = props;
  return <div className='flex flex-col h-full'>
    <div className='flex flex-col grow'>
      <Header />
      <main className='grow w-6x p-0 pl-4 pr-4 m-4 ml-auto mr-auto'>
        {children}
      </main>
    </div>
    <Footer />
  </div>
}
