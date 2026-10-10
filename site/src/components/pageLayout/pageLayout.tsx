import { FC } from 'react';

import Header from '@/components/pageLayout/Header';
import { Footer } from '@/components/pageLayout/footer';
import type { Tab } from '@/components/pageContent';

interface LayoutProps {
  children: React.ReactNode;
  tabs: Tab[];
}

export const PageLayout: FC<LayoutProps> = (props) => {
  const { children, tabs } = props;
  return <div className='flex flex-col h-full bg-(--color-background)'>
    <div className='flex flex-col grow'>
      <Header tabs={tabs} />
      <main className='grow w-6x p-0 pl-4 pr-4 m-4 ml-auto mr-auto'>
        {children}
      </main>
    </div>
    <Footer />
  </div>;
}
