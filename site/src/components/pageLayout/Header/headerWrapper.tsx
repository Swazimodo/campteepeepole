import { Drawer, DrawerAnimationState, useDrawerState } from '@/components/drawer'
import { Nav } from '@/components/pageLayout/Header/nav'
import { SiteHeader } from '@/components/pageLayout/Header/SiteHeader'
import type { Tab } from '@/components/pageContent'

export const HeaderWrapper = ({ tabs }: { tabs: Tab[] }) => {
  const drawerState = useDrawerState(DrawerAnimationState.Closed)

  let nav = <Nav tabs={tabs} onNavigation={drawerState.handleCloseDrawer} />
  return <>
    <SiteHeader onMenuClick={drawerState.handleOpenDrawer} />
    <div className='max-sm:hidden'>
      {nav}
    </div>
    <Drawer drawerState={drawerState}>{nav}</Drawer>
  </>
}
