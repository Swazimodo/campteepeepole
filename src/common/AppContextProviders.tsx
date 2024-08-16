import { FC, useContext } from "react";
import { ToastContextProvider, toastContext } from "common/toast";

interface WithChildrenProps {
  children?: React.ReactNode
}

export const AppContextProviders: FC<WithChildrenProps> = (props) => {
  const { children } = props
  return <ToastContextProvider>
    <RenderWhenReady>
      {children}
    </RenderWhenReady>
  </ToastContextProvider>
}

// This will not render the children until all context values are truthy
const RenderWhenReady: FC<WithChildrenProps> = (props) => {
  const { children } = props
  const toastCtx = useContext(toastContext)
  if (!toastCtx) {
    return null
  }
  return <>{children}</>
}
