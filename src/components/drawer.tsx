import { FC, useCallback, useState } from "react";

export enum DrawerAnimationState {
  Open,
  Closed
}

export interface DrawerState {
  currentState: DrawerAnimationState
  targetState: DrawerAnimationState
  handleToggleDrawer: (event: React.MouseEvent) => void
  handleCloseDrawer: (event: React.MouseEvent) => void
  handleOpenDrawer: (event: React.MouseEvent) => void
  setCurrentState: (state: DrawerAnimationState) => void
}

export const useDrawerState = (initialState: DrawerAnimationState): DrawerState => {
  const [currentState, setCurrentState] = useState<DrawerAnimationState>(initialState)
  const [targetState, setTargetState] = useState<DrawerAnimationState>(initialState)

  // event handlers to open and close drawer
  const handleToggleDrawer = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    if (targetState === DrawerAnimationState.Open) {
      setTargetState(DrawerAnimationState.Closed)
    } else {
      setTargetState(DrawerAnimationState.Open)
    }
  }, [targetState, setTargetState])
  const handleCloseDrawer = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    if (targetState === DrawerAnimationState.Open) {
      setTargetState(DrawerAnimationState.Closed)
    }
  }, [targetState, setTargetState])
  const handleOpenDrawer = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    if (targetState === DrawerAnimationState.Closed) {
      setTargetState(DrawerAnimationState.Open)
    }
  }, [targetState, setTargetState])

  return {
    currentState,
    targetState,
    handleToggleDrawer,
    handleCloseDrawer,
    handleOpenDrawer,
    setCurrentState
  }
}

interface DrawerProps {
  children: React.ReactNode;
  drawerState: DrawerState;
}

export const Drawer: FC<DrawerProps> = (props) => {
  const { children, drawerState: { currentState, targetState, setCurrentState, handleCloseDrawer } } = props
  // set the current state to the target state after the animation ends
  const handleAnimationEnd = useCallback(
    () => {
      setCurrentState(targetState)
    },
    [targetState, setCurrentState])

  // prevent menu div or child clicks from bubbling up and closing the drawer
  const handleClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, [])

  if (currentState === targetState && currentState === DrawerAnimationState.Closed) {
    return null
  }

  let animationFadeClass;
  let animationSlideClass;
  if (targetState === DrawerAnimationState.Open) {
    animationFadeClass = "animate-fade-in";
    animationSlideClass = "animate-slide-in";
  } else {
    animationFadeClass = "animate-fade-out";
    animationSlideClass = "animate-slide-out";
  }

  return <div
    className={`overflow-hidden fixed w-full h-full bg-[rgba(0,0,0,0.5)] ${animationFadeClass}`}
    onClick={handleCloseDrawer}
  >
    {targetState === DrawerAnimationState.Open && <button
      className="fixed h-8 w-8 rounded-2xl border-none m-1 right-0 z-50 bg-[rgba(255,255,255,0.5)]"
      onClick={handleCloseDrawer}
    >X</button>}
    <div
      className={`bg-green-700 relative h-full ml-10 overflow-y-auto ${animationSlideClass}`}
      onAnimationEnd={handleAnimationEnd}
      onClick={handleClick}
    >
      {children}
    </div>
  </div>
}
