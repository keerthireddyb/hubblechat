/* eslint-disable */
import React from 'react';

const Dropdown = ({ setSource, sources, selected }) => (
  <div className="dropdown-container">
    <label htmlFor="dropdown">Current Source: {selected}</label>
    <select id="dropdown" value={selected} onChange={(event) => setSource(event.target.value)}>
      {sources.map((source, idx) => (
        <option key={idx} value={source} label={source}>{source}</option>
      ))}
    </select>
  </div>
);

export default Dropdown;
