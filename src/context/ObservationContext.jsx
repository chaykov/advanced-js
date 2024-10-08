import React, { createContext, useState, useContext } from "react";

const ObservationContext = createContext();

export const useObservations = () => useContext(ObservationContext);

export const ObservationProvider = ({ children }) => {
  const [observations, setObservations] = useState([]);

  const addObservation = (newObservation) => {
    setObservations((prevObservations) => [
      newObservation,
      ...prevObservations,
    ]);
  };

  return (
    <ObservationContext.Provider value={{ observations, addObservation }}>
      {children}
    </ObservationContext.Provider>
  );
};
