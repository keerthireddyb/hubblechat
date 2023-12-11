/* eslint-disable */

import React, { useState, useEffect, useContext, useRef } from "react";
import {
  MainContainer,
  MessageInput,
  MessageContainer,
  MessageList,
  MessageHeader,
} from "@minchat/react-chat-ui";
import backendCall from "./backendCall";
import { UpdateSourceContext } from "./hooks/updateSource";

const ChatBot = () => {
  // const currentSource = useUpdateSource();
  // const [selectedSource, setSelectedSource] = useState(currentSource);
  const { source, updateSource } = useContext(UpdateSourceContext);
  console.debug(`selected source: ${JSON.stringify(source)}`);
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your maintenance resource assistant. Ask me anything!",
      user: {
        id: 'Hubbell Bot',
        name: 'Hubbell AI Assistant',
        avatar: require('./bot.png'),
      },
    },
  ]);

  useEffect(() => {
    setTimeout(async () => {
      updateSource(source);
      console.log(`new source: ${source}`);
    }, [source, UpdateSourceContext]);
  }, 1000);

  const chatContainerRef = useRef(null);

  // useEffect(() => {
  //   if (chatContainerRef) {
  //     chatContainerRef.scrollToBottom = true;
  //   }
  // }, [messages]);
 

  const handleSourceChange = (newSource) => {
    updateSource(newSource);
  };

  const addMessage = async (text, userId, userName) => {
    const newMessage = {
      text,
      user: {
        id: userId,
        name: userName,
      },
    };
    setMessages([...messages, newMessage]);

    try {
      const { data } = await backendCall(newMessage.text, source);
      let botResponse = '';
      // botResponse = (data.source) ? `${data.source}\n${data.page}` : JSON.stringify(data);

      if (data.source) {
        botResponse = `${data.source}`;
        const botResponse2 = data.answer;
        const responseMessage = {
          text: botResponse,
          user: {
            id: 'Hubbell',
          },
        };
        const responseMessage2 = {
          text: botResponse2,
          user: {
            id: 'Hubbell',
            avatar: require('./bot.png'),
          },
        };
        setMessages((prevMessages) => [...prevMessages, responseMessage]);
        setMessages((prevMessages) => [...prevMessages, responseMessage2]);
      } else if(data.constructor === Array) {
        const responseArray = data.map(({ source }) => ({
          text: source,
          user: {
            id: 'Hubbell',
          }
        }));

        responseArray[responseArray.length - 1].user.avatar = require('./bot.png');
        responseArray.unshift({
          text: 'Below are the sources with relevant information. Please select source to look into from dropdown above.',
          user: {
            id: 'Hubbell',
          }
        })
        setMessages((prevMessages) => [...prevMessages, ...responseArray]);
      } else {
        botResponse = {
          text: data,
          user: {
            id: 'Hubbell',
            avatar: require('./bot.png')
          },
        }
        setMessages((prevMessages) => [...prevMessages, botResponse]);      
      }

      updateSource(data.source);
    } catch (error) {
      console.error("Error calling backend:", error);
    }

  };

  return (

    <MainContainer style={{ height: '85vh', width: '100%' }}>
      <MessageContainer>
        <div>
          <p>Current Source: {source}</p>
          <label htmlFor="sourceDropdown"></label>
          <select
            id="sourceDropdown"
            value={source}
            onChange={(e) => handleSourceChange(e.target.value)}
          >
            <option value="All">All</option>
            <option value="6089- Manual (FLATTEN-STP-REFLATTEN).pdf">6089- Manual (FLATTEN-STP-REFLATTEN).pdf</option>
            <option value="6087- Manual (SAW-CHAMFER)-1.pdf">6087- Manual (SAW-CHAMFER)-1.pdf</option>
            <option value="6088- Manual (WASH-ANNEAL).pdf">6088- Manual (WASH-ANNEAL).pdf</option>
            <option value="CAP_2013_Inch.pdf">CAP_2013_Inch.pdf</option>
            <option value="Coil Design 801-9038.pdf">Coil Design 801-9038.pdf</option>
            <option value="Coorstek Sales Order 1712270.pdf">Coorstek Sales Order 1712270.pdf</option>
            <option value="Declaration of Comformity 443-0368.pdf">Declaration of Comformity 443-0368.pdf</option>
            <option value="Dew Point Warning 431-0105.pdf">Dew Point Warning 431-0105.pdf</option>
            <option value="Dimension Drawing 443-0367.pdf  ">Dimension Drawing 443-0367.pdf</option>
            <option value="eds3400.pdf">eds3400.pdf</option>
            <option value="EMF Safety 443-0394-00.pdf">EMF Safety 443-0394-00.pdf</option>
            <option value="epson_g3_robot_manual(r14).pdf">epson_g3_robot_manual(r14).pdf</option>
            <option value="epson_rc180_controller_manual(r15)">epson_rc180_controller_manual(r15)</option>
            <option value="epson_rc700_rc700a_controller_manual(r27)">epson_rc700_rc700a_controller_manual(r27)</option>
            <option value="FOCAL 1 Troubleshooting Guide.pdf">FOCAL 1 Troubleshooting Guide.pdf</option>
            <option value="Hydac Radiator.pdf">Hydac Radiator.pdf</option>
            <option value="LE PP X-Datasheet.pdf">LE PP X-Datasheet.pdf</option>
            <option value="Operators Manual 801-9627-00.pdf">Operators Manual 801-9627-00.pdf</option>
            <option value="Plumbing Drawing 805-9808.dwg.pdf">Plumbing Drawing 805-9808.dwg.pdf</option>
            <option value="Plumbing Drawing 805-9814.dwg.pdf">Plumbing Drawing 805-9814.dwg.pdf</option>
            <option value="Plumbing Drawing 805-9686.dwg.pdf">Plumbing Drawing 805-9686.dwg.pdf</option>
            <option value="Plumbing Schematic 802-9326.dwg.pdf">Plumbing Schematic 802-9326.dwg.pdf</option>
            <option value="Pyrometer Controller 805-9697.dwg.pdf ">Pyrometer Controller 805-9697.dwg.pdf </option>
            <option value="Safety Lift 801-9393-00.pd">Safety Lift 801-9393-00.pd</option>
            <option value="Schamatic 803-9995.dwg.pdf">Schamatic 803-9995.dwg.pdf</option>
            <option value="Standard Warrenty 410-0002.pdf">Standard Warrenty 410-0002.pdf</option>
            <option value="TD0026A-EN00-0000-00_092017_3.pdf">TD0026A-EN00-0000-00_092017_3.pdf</option>
            <option value="Technical Handbook 801-9655-00.pdf">Technical Handbook 801-9655-00.pdf</option>
            <option value="Workhead Manual 801-9565-00.pdf">Workhead Manual 801-9565-00.pdf</option>
          </select>
        </div>
        <MessageHeader showBack= {false}/>
        <MessageList currentUserId='logan' messages={messages} />
        <MessageInput
          placeholder="Type message here"
          onSendMessage={(text) => addMessage(text, 'logan', 'Logan')}
        />
      </MessageContainer>
    </MainContainer>

  );
};


export default ChatBot;
