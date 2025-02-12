import { DependencyList, useEffect, useState } from "react"

export const useClientSideMemo = <T,>(func: () => T, deps: DependencyList): T | null => {
  const [value, setValue] = useState<T | null>(null)
  Object.assign([], deps)
  useEffect(() => {
    setValue(func())
  }, [func, ...deps])
  return value
}
