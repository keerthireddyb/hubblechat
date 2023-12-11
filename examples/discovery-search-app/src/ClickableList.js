/* eslint-disable */
import { Message } from '@chatscope/chat-ui-kit-react';

const ClickableList = ({ list, message, selectManual }) => (
  <Message.CustomContent>
    <ul>
      {list.map(({ source }, index) => (
        <li key={index} onClick={(e) => selectManual(e, message)}>{source}</li>
      ))}
    </ul>
  </Message.CustomContent>
);

export default ClickableList;
