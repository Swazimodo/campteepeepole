import { FC, useCallback, useState } from "react";
import styled, { css, keyframes } from "styled-components";

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

  return <DrawerWrapperDiv
    $targetState={targetState}
    onClick={handleCloseDrawer}
  >
    {targetState === DrawerAnimationState.Open && <CloseButton
      onClick={handleCloseDrawer}
    >X</CloseButton>}
    <DrawerContentDiv
      $targetState={targetState}
      onAnimationEnd={handleAnimationEnd}
      onClick={handleClick}
    >
      {children}
    </DrawerContentDiv>
  </DrawerWrapperDiv>
}

const CloseButton = styled.button`
  position: fixed;
  width: 32px;
  height: 32px;
  border: none;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.5);
  margin: 4px;
  border-radius: 16px;
`

interface DrawerDivProps {
  $targetState: DrawerAnimationState
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
  ${props => props.$targetState === DrawerAnimationState.Closed && css`
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
  overflow-y: auto;

  animation: ${slideIn} .3s forwards;
  ${props => props.$targetState === DrawerAnimationState.Closed && css`
    animation: ${slideOut} .3s forwards;
  `}
`