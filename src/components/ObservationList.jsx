import React from "react";
import { useObservations } from "../context/ObservationContext";

function ObservationList() {
  const { observations } = useObservations();

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-3xl font-bold mb-4 text-purple-300">
        Lista Obserwacji
      </h2>
      {observations.length === 0 ? (
        <p className="text-gray-400">Brak zgłoszonych obserwacji.</p>
      ) : (
        <ul className="space-y-4">
          {observations.map((obs) => (
            <li key={obs.id} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-400">
                {obs.title}
              </h3>
              <p className="text-gray-300">Lokalizacja: {obs.location}</p>
              <p className="text-gray-300">
                Data: {new Date(obs.timestamp).toLocaleString()}
              </p>
              <p className="text-gray-300">Typ: {obs.type}</p>
              <p className="text-gray-400 mt-2">{obs.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ObservationList;
