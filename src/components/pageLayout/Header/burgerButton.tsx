import { FC } from "react";

interface BurgerButtonProps {
  onClick: (event: React.MouseEvent) => void
}

export const BurgerButton: FC<BurgerButtonProps> = (props) => {
  return <button
    className="sm:hidden"
    onClick={props.onClick}
  >
    burger
  </button>
}
