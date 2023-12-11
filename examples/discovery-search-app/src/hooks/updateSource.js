/* eslint-disable */
import React, { useState, useContext, createContext } from 'react';

export const UpdateSourceContext = createContext("All");

export const UpdateSourceProvider = ({ children }) => {
  const [source, setSource] = useState('All');

  const updateSource = (newSource) => {
    setSource(newSource);
  };

  const contextValue = {
    source,
    updateSource,
  };

  return (
    <UpdateSourceContext.Provider value={contextValue}>
      {children}
    </UpdateSourceContext.Provider>
  );
};

export const useUpdateSource = () => {
  const updateSource = useContext(UpdateSourceContext);

  if (!updateSource) {
    throw new Error('clearly there is an error');
  }

  return updateSource;
};