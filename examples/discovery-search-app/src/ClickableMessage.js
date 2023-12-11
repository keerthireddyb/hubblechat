/* eslint-disable */
import { Message } from '@chatscope/chat-ui-kit-react';

const ClickableMessage = ({ text }) => (
  <Message.CustomContent>
    <div value={text}>
      {text}
    </div>
  </Message.CustomContent>
);

export default ClickableMessage;
