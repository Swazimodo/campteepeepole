import { Drawer, DrawerAnimationState, useDrawerState } from '@/components/drawer'
import { MediaSizes, useMediaQuery } from '@/components/mediaQueries'
import { Nav } from '@/components/pageLayout/Header/nav'
import { SiteHeader } from '@/components/pageLayout/Header/SiteHeader'

export const HeaderWrapper = () => {
  const drawerState = useDrawerState(DrawerAnimationState.Closed)
  const { matchesDown } = useMediaQuery(MediaSizes.sm)

  let nav = <Nav onNavigation={drawerState.handleCloseDrawer} />
  if (matchesDown) {
    nav = <Drawer drawerState={drawerState}>{nav}</Drawer>
  }
  return <>
    <SiteHeader onMenuClick={drawerState.handleOpenDrawer} />
    {nav}
  </>
}
