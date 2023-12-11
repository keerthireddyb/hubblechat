/* eslint-disable */
import React, { useState, useEffect, useContext } from 'react';
import {
  Avatar,
  MainContainer,
  ChatContainer,
  Message,
  MessageList,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import { UpdateSourceContext } from './hooks/updateSource';
import ClickableList from './ClickableList';
import backendCall from './backendCall';
// import Dropdown from './Dropdown';
import sources from './sources';
import botPng from './Watsonx.png';
import './app.scss';

const Chatbot = () => {
  const bot = 'HubbellBot';
  const user = 'user';
  const { source, updateSource } = useContext(UpdateSourceContext);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am your AI Assistant! What maintenance questions can I assist you with today?",
      sentTime: "just now",
      sender: bot,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);


  useEffect(() => {
    console.log(`new source: ${source}`);
  }, [source]);

  const handleManualSelect = async (event, message) => {
    const newSource = event.target.innerText || 'All';
    updateSource(newSource);
    // console.debug(messageObj);
    // const { message } = messageObj.payload.props;

    await handleSendRequest(message, newSource);
  };

  const handleSendRequest = async (message, newSource) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: user,
    };

    if (!newSource) setMessages((prevMessages) => [...prevMessages, newMessage]);
    if (isTyping) return;
    setIsTyping(true);

    try {
      const response = await backendCall(message, newSource || source);
      const { data } = response;
      console.debug(data);
      const botResponse = {
        message: 'An error occurred. Please try again',
        sender: bot,
      };

      if (data.source) {
        // Remove newline character that might appear in the beginning of answer
        botResponse.message = data.answer.replace(/^(\n)*/, '');
        if (!newSource) updateSource(data.source);
      } else if (data.constructor === Array) {
        const botResponses = [];
        botResponse.message = 'Please select from the sources below:';
        botResponses.push(botResponse);
        botResponses.push({
          type: 'custom',
          sender: bot,
          payload: <ClickableList
            list={data}
            message={message}
            selectManual={handleManualSelect}
          />,
        })
        // botResponses.push(...data.map(({ source }) => ({
        //   type: 'custom',
        //   sender: bot,
        //   payload: <ClickableMessage
        //     text={source}
        //   />,
        // })));
        setMessages((prevMessages) => [...prevMessages, ...botResponses]);
        return;
      } else if(typeof data === 'string') {
        botResponse.message = data;
      }

      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className="chatbot-container">
      <div className="dropdown-container">
        <label htmlFor="dropdown">Current Source: {source}</label>
        <select id="dropdown" value={source} onChange={(event) => updateSource(event.target.value)}>
          {sources.map((source, idx) => (
            <option key={idx} value={source} label={source}>{source}</option>
          ))}
        </select>
      </div>
          {/* <Dropdown
            setSource={updateSource}
            sources={sources}
            selected={source}
          /> */}
      <MainContainer>
        <ChatContainer>
          <MessageList
            scrollBehavior="auto"
            typingIndicator={isTyping
              ? <TypingIndicator content="" />
              : null}
          >
              {messages.map((message, idx) => {
                if (message.sender === bot) {
                  if (message.type === 'custom') {
                    return <Message
                      key={idx}
                      model={message}
                      className="chatbot-message__bot chatbot-widget__container"
                      // onClick={(e) => handleManualSelect(e, message)}
                    />
                  }
                  return <Message
                    className="chatbot-message__bot"
                    key={idx}
                    model={message}
                  >
                    <Avatar src={botPng} />
                  </Message>
                }
                return <Message
                  className="chatbot-message__user"
                  key={idx}
                  model={message}
                />
              })}
          </MessageList>
          <MessageInput placeholder="Type something..." onSend={(_, textContent) => handleSendRequest(textContent)} />
        </ChatContainer>
      </MainContainer>
    </div>
  )
};

export default Chatbot;
