/* eslint-disable */
/* prettier-ignore */

import React from 'react';
import './app.scss';
import CustomSearch from './CustomSearch';
import { DiscoveryDropDown } from '@ibm-watson/discovery-react-components';
// import ChatBot from './ChatBot';
import { Route, Routes, NavLink } from 'react-router-dom';
import logo from './hubbell-logo.png';
import { UpdateSourceProvider } from './hooks/updateSource';
import ChatBot from './ChatBot2';

const Sidebar = () => (
  <div className="sidebar">

    <NavLink 
      to="/home" 
      className="sidebar-link" 
      activeClassName="active-link"
    >
      Home
    </NavLink>
    
    <NavLink
      to="/discovery"
      className="sidebar-link"
      activeClassName="active-link"
    >
      Maintenance Schedule
    </NavLink>
    
    {/* <NavLink

      to="/chat"
      className="sidebar-link"
      activeClassName="active-link"
    >
      Chat
    </NavLink> */}

    {/* <NavLink
      to="/chat"
      className="sidebar-link"
      activeClassName="active-link"
    >
      Chat
    </NavLink> */}

    <NavLink
      to="/"
      className="sidebar-link"
      activeClassName="active-link"
    >
      Document Search
    </NavLink>

  </div>
);

const App = () => {
  return (
    <UpdateSourceProvider>
      <React.Fragment>
        <div className="top-bar">
          <img src={logo} alt="Logo" />
        </div>
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route exact path="/" element={<CustomSearch />} />
            <Route exact path="/discovery" element={<DiscoveryDropDown />} />
            {/* <Route exact path="/chat" element={<ChatBot />} /> */}
            <Route exact path="/home" element={<ChatBot/>} />

          </Routes>
        </div>
      </React.Fragment>
    </UpdateSourceProvider>
  );
};

export default App;