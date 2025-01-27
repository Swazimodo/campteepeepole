import { FC, useCallback, useState } from "react";

export enum DrawerAnimationFinalState {
  Open,
  Closed
}

enum DrawerAnimationTransientState {
  Opening,
  Closing
}

export type DrawerAnimationState = DrawerAnimationFinalState | DrawerAnimationTransientState

interface DrawerProps {
  children: React.ReactNode;
  drawerState: DrawerState;
}

export const Drawer: FC<DrawerProps> = (props) => {
  const { children, drawerState } = props

  if (drawerState.targetState === DrawerAnimationFinalState.Closed) {
    return null
  }

  return <div
    onAnimationEnd={props.drawerState.handleAnimationEnd}
  >
    {children}
  </div>
}

export interface DrawerState {
  currentState: DrawerAnimationState
  targetState: DrawerAnimationFinalState
  handleToggleDrawer: () => void
  handleCloseDrawer: () => void
  handleOpenDrawer: () => void
  handleAnimationEnd: () => void
}

export const useDrawerState = (initialState: DrawerAnimationFinalState): DrawerState => {
  const [currentState, setCurrentState] = useState<DrawerAnimationState>(initialState)
  const [targetState, setTargetState] = useState<DrawerAnimationFinalState>(initialState)

  // event handlers to open and close drawer
  const handleToggleDrawer = useCallback(() => {
    if (targetState === DrawerAnimationFinalState.Open) {
      setTargetState(DrawerAnimationFinalState.Closed)
      setCurrentState(DrawerAnimationTransientState.Closing)
    } else {
      setTargetState(DrawerAnimationFinalState.Open)
      setCurrentState(DrawerAnimationTransientState.Opening)
    }
  }, [targetState, setTargetState, setCurrentState])
  const handleCloseDrawer = useCallback(() => {
    if (targetState === DrawerAnimationFinalState.Open) {
      setTargetState(DrawerAnimationFinalState.Closed)
      setCurrentState(DrawerAnimationTransientState.Closing)
    }
  }, [targetState, setTargetState, setCurrentState])
  const handleOpenDrawer = useCallback(() => {
    if (targetState === DrawerAnimationFinalState.Closed) {
      setTargetState(DrawerAnimationFinalState.Open)
      setCurrentState(DrawerAnimationTransientState.Opening)
    }
  }, [targetState, setTargetState, setCurrentState])

  // event handler to detect animation completion
  const handleAnimationEnd = useCallback(
    () => setCurrentState(targetState), [targetState, setCurrentState])

  return {
    currentState,
    targetState,
    handleToggleDrawer,
    handleCloseDrawer,
    handleOpenDrawer,
    handleAnimationEnd
  }
}