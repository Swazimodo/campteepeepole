import { Drawer, DrawerAnimationState, useDrawerState } from '@/components/drawer'
import { Nav } from '@/components/pageLayout/Header/nav'
import { SiteHeader } from '@/components/pageLayout/Header/SiteHeader'

export const HeaderWrapper = () => {
  const drawerState = useDrawerState(DrawerAnimationState.Closed)

  let nav = <Nav onNavigation={drawerState.handleCloseDrawer} />
  return <>
    <SiteHeader onMenuClick={drawerState.handleOpenDrawer} />
    <div className='max-sm:hidden'>
      {nav}
    </div>
    <Drawer drawerState={drawerState}>{nav}</Drawer>
  </>
}
