import { FC, useCallback, useState } from "react";
import styled, { css, keyframes } from "styled-components";

export enum DrawerAnimationState {
  Open,
  Closed
}

export interface DrawerState {
  currentState: DrawerAnimationState
  targetState: DrawerAnimationState
  handleToggleDrawer: () => void
  handleCloseDrawer: () => void
  handleOpenDrawer: () => void
  setCurrentState: (state: DrawerAnimationState) => void
}

export const useDrawerState = (initialState: DrawerAnimationState): DrawerState => {
  const [currentState, setCurrentState] = useState<DrawerAnimationState>(initialState)
  const [targetState, setTargetState] = useState<DrawerAnimationState>(initialState)

  // event handlers to open and close drawer
  const handleToggleDrawer = useCallback(() => {
    if (targetState === DrawerAnimationState.Open) {
      setTargetState(DrawerAnimationState.Closed)
    } else {
      setTargetState(DrawerAnimationState.Open)
    }
  }, [targetState, setTargetState])
  const handleCloseDrawer = useCallback(() => {
    if (targetState === DrawerAnimationState.Open) {
      setTargetState(DrawerAnimationState.Closed)
    }
  }, [targetState, setTargetState])
  const handleOpenDrawer = useCallback(() => {
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
  // event handler to detect animation completion
  const handleAnimationEnd = useCallback(
    () => {
      setCurrentState(targetState)
    },
    [targetState, setCurrentState])

  if (currentState === targetState && currentState === DrawerAnimationState.Closed) {
    return null
  }

  return <DrawerWrapperDiv targetState={targetState}>
    <DrawerContentDiv
      targetState={targetState}
      onAnimationEnd={handleAnimationEnd}
    >
      <button onClick={handleCloseDrawer}>close</button>
      {children}
    </DrawerContentDiv>
  </DrawerWrapperDiv>
}

interface DrawerDivProps {
  targetState: DrawerAnimationState
}

const backdropFadeIn = keyframes`
  from {
    background-color: rgba(255, 255, 255, 0);
  }
  to {
    background-color: rgba(0, 0, 0, 0.5);
  }
`

const backdropFadeOut = keyframes`
  from {
    background-color: rgba(0, 0, 0, 0.5);
  }
  to {
    background-color: rgba(255, 255, 255, 0);
  }
`

const DrawerWrapperDiv = styled.div<DrawerDivProps>`
  background-color: rgba(0, 0, 0, 0.5);

  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;

  animation: ${backdropFadeIn} .3s forwards;
  ${props => props.targetState === DrawerAnimationState.Closed && css`
    animation: ${backdropFadeOut} .3s forwards;
  `}
`

const slideIn = keyframes`
  from {
    transform: translate(100%, 0);
    opacity:0;
  }
  to {
    transform: translate(0%, 0);
    opacity: 1;
  }
`

const slideOut = keyframes`
  from {
    transform: translate(0%, 0);
    opacity: 1;
  }
  to {
    transform: translate(100%, 0);
    opacity:0;
  }
`

const DrawerContentDiv = styled.div<DrawerDivProps>`
  background-color: green;

  position: relative;
  width: calc(100% - 40px);
  height: 100%;
  margin-left: 40px;

  animation: ${slideIn} .3s forwards;
  ${props => props.targetState === DrawerAnimationState.Closed && css`
    animation: ${slideOut} .3s forwards;
  `}
`