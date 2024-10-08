import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { ObservationProvider } from "./context/ObservationContext.jsx";
import HomePage from "./components/HomePage";
import ObservationForm from "./components/ObservationForm.jsx";
import ObservationList from "./components/ObservationList.jsx";
// import "./App.css";

function App() {
  return (
    <ObservationProvider>
      <Router>
        <div className="App bg-gray-900 text-gray-300 min-h-screen flex flex-col">
          <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
              <Link to="/" className="text-2xl font-bold text-purple-400">
                SkyWitness
              </Link>
              <ul className="flex space-x-4">
                <li>
                  <Link to="/" className="hover:text-purple-400">
                    Strona główna
                  </Link>
                </li>
                <li>
                  <Link to="/add-observation" className="hover:text-purple-400">
                    Dodaj obserwację
                  </Link>
                </li>
                <li>
                  <Link to="/observations" className="hover:text-purple-400">
                    Obserwacje
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-purple-400">
                    O nas
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add-observation" element={<ObservationForm />} />
            <Route path="/observations" element={<ObservationList />} />
            {/* Dodaj więcej ścieżek dla innych podstron */}
          </Routes>

          <footer className="bg-gray-800 text-white mt-auto p-4">
            <div className="container mx-auto text-center">
              <p>&copy; 2024 SkyWitness. Wszelkie prawa zastrzeżone.</p>
            </div>
          </footer>
        </div>
      </Router>
    </ObservationProvider>
  );
}

export default App;
