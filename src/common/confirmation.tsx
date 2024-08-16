import { FC } from 'react';
import styled from 'styled-components'

interface MessageProps {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: FC<MessageProps> = (props) => {
  return <CenterPointDiv>
    <PopoverDialog open>
      {props.title && <div>{props.title}</div>}
      <MessageDiv>{props.message}</MessageDiv>
      <div>
        <button onClick={props.onConfirm}>Yes</button>
        <button onClick={props.onCancel}>Cancel</button>
      </div>
    </PopoverDialog>
  </CenterPointDiv>
}

const CenterPointDiv = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const PopoverDialog = styled.dialog`
  width: 300px;
  height: 200px;
  padding: 16px;
  border: 2px solid #494949;

  display: flex;
  flex-direction: column;
`

const MessageDiv = styled.div`
  flex-grow: 1;
`
