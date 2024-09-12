import { FC, useContext, useEffect } from "react";
import { ToastContextProvider, toastContext } from "common/toast";
import { useSiteConfig } from "config/useSiteConfig";

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
  const { browserTitle } = useSiteConfig();
  useEffect(() => {
    console.log("update title")
    document.title = browserTitle
  }, [browserTitle])

  const toastCtx = useContext(toastContext)
  if (!toastCtx) {
    return null
  }
  return <>{props.children}</>
}
