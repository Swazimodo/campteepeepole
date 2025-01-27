import { FC } from "react"

interface BurgerButtonProps {
  onClick: () => void
}

export const BurgerButton: FC<BurgerButtonProps> = (props) => {
  return <button onClick={props.onClick}>burger</button>
}