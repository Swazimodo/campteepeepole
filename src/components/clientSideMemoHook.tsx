import { DependencyList, useEffect, useState } from "react"

/**
 * Acts like the useMemo hook but will only evaluate client side.
 * Useful for preventing SSR from running window related code.
 * @param calculateValue function containing the client side code
 * @param deps The list of all reactive values referenced inside of the `calculateValue` code
 * @returns result from executing `calculateValue`
 */
export const useClientSideMemo = <T,>(calculateValue: () => T, deps: DependencyList): T | null => {
  const [value, setValue] = useState<T | null>(null)
  useEffect(() => {
    setValue(calculateValue())
  }, [setValue, calculateValue, ...deps])
  return value
}
