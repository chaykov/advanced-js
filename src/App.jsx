import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
} from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Chart from "chart.js/auto";
import "leaflet/dist/leaflet.css";
import "./App.css";

// Kontekst dla obserwacji
const ObservationContext = createContext();

// Główny komponent App
function App() {
  const [observations, setObservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Funkcja do dodawania obserwacji
  const addObservation = (newObservation) => {
    setObservations((prevObservations) => [
      { ...newObservation, id: Date.now(), userId: currentUser?.id },
      ...prevObservations,
    ]);
  };

  // Funkcja do edycji obserwacji
  const editObservation = (id, updatedObservation) => {
    setObservations((prevObservations) =>
      prevObservations.map((obs) =>
        obs.id === id ? { ...obs, ...updatedObservation } : obs
      )
    );
  };

  // Funkcja do usuwania obserwacji
  const deleteObservation = (id) => {
    setObservations((prevObservations) =>
      prevObservations.filter((obs) => obs.id !== id)
    );
  };

  // Funkcja do rejestracji użytkownika
  const registerUser = (username, password) => {
    const newUser = { id: Date.now(), username, password };
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setCurrentUser(newUser);
  };

  // Funkcja do logowania użytkownika
  const loginUser = (username, password) => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  // Funkcja do wylogowania użytkownika
  const logoutUser = () => {
    setCurrentUser(null);
  };

  return (
    <ObservationContext.Provider
      value={{
        observations,
        addObservation,
        editObservation,
        deleteObservation,
      }}
    >
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
                  <Link to="/observations" className="hover:text-purple-400">
                    Obserwacje
                  </Link>
                </li>
                <li>
                  <Link to="/map" className="hover:text-purple-400">
                    Mapa
                  </Link>
                </li>
                <li>
                  <Link to="/stats" className="hover:text-purple-400">
                    Statystyki
                  </Link>
                </li>
                {currentUser ? (
                  <>
                    <li>
                      <Link to="/profile" className="hover:text-purple-400">
                        Profil
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={logoutUser}
                        className="hover:text-purple-400"
                      >
                        Wyloguj
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link to="/login" className="hover:text-purple-400">
                      Zaloguj
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/observations" element={<ObservationList />} />
            <Route path="/add-observation" element={<ObservationForm />} />
            <Route path="/map" element={<ObservationMap />} />
            <Route path="/stats" element={<Statistics />} />
            <Route
              path="/login"
              element={<LoginForm loginUser={loginUser} />}
            />
            <Route
              path="/register"
              element={<RegisterForm registerUser={registerUser} />}
            />
            <Route
              path="/profile"
              element={<UserProfile user={currentUser} />}
            />
          </Routes>

          <footer className="bg-gray-800 text-white mt-auto p-4">
            <div className="container mx-auto text-center">
              <p>&copy; 2024 SkyWitness. Wszelkie prawa zastrzeżone.</p>
            </div>
          </footer>
        </div>
      </Router>
    </ObservationContext.Provider>
  );
}

// Komponent strony głównej
function HomePage() {
  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-4xl font-bold text-purple-400 mb-4">
        Witaj w SkyWitness
      </h1>
      <p className="text-xl mb-4">
        Odkryj nieznane zjawiska na niebie i podziel się swoimi obserwacjami z
        całym światem.
      </p>
      <Link
        to="/add-observation"
        className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition duration-300"
      >
        Dodaj obserwację
      </Link>
    </div>
  );
}

// Komponent formularza obserwacji
function ObservationForm() {
  const { addObservation } = useContext(ObservationContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    latitude: "",
    longitude: "",
    type: "UFO",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addObservation({
      ...formData,
      timestamp: new Date(`${formData.date}T${formData.time}`).toISOString(),
    });
    navigate("/observations");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="container mx-auto mt-8 p-4 max-w-lg"
    >
      <h2 className="text-2xl font-bold text-purple-400 mb-4">
        Dodaj nową obserwację
      </h2>
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-400"
        >
          Tytuł
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-400"
          >
            Data
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div>
          <label
            htmlFor="time"
            className="block text-sm font-medium text-gray-400"
          >
            Czas
          </label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
        </div>
      </div>
      <div className="mb-4">
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-400"
        >
          Lokalizacja
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="latitude"
            className="block text-sm font-medium text-gray-400"
          >
            Szerokość geograficzna
          </label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            step="any"
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div>
          <label
            htmlFor="longitude"
            className="block text-sm font-medium text-gray-400"
          >
            Długość geograficzna
          </label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            step="any"
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
        </div>
      </div>
      <div className="mb-4">
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-400"
        >
          Typ obserwacji
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
        >
          <option value="UFO">UFO</option>
          <option value="Zjawisko astronomiczne">Zjawisko astronomiczne</option>
          <option value="Niezidentyfikowany obiekt">
            Niezidentyfikowany obiekt
          </option>
        </select>
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-400"
        >
          Opis
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300"
      >
        Dodaj obserwację
      </button>
    </form>
  );
}

// Komponent listy obserwacji
function ObservationList() {
  const { observations, deleteObservation } = useContext(ObservationContext);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("date");

  const filteredObservations = observations
    .filter(
      (obs) =>
        obs.title.toLowerCase().includes(filter.toLowerCase()) ||
        obs.location.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "date") {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else if (sort === "type") {
        return a.type.localeCompare(b.type);
      }
      return 0;
    });

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">
        Lista Obserwacji
      </h2>
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Filtruj obserwacje..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-grow rounded-md bg-gray-700 border-gray-600 text-white p-2"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-md bg-gray-700 border-gray-600 text-white p-2"
        >
          <option value="date">Sortuj po dacie</option>
          <option value="type">Sortuj po typie</option>
        </select>
      </div>
      <ul className="space-y-4">
        {filteredObservations.map((obs) => (
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
            <button
              onClick={() => deleteObservation(obs.id)}
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-300"
            >
              Usuń
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Komponent mapy obserwacji
function ObservationMap() {
  const { observations } = useContext(ObservationContext);
  const position = [52.237049, 21.017532]; // Przykładowa pozycja centralna (Warszawa)

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">
        Mapa Obserwacji
      </h2>
      <MapContainer
        center={position}
        zoom={6}
        style={{ height: "calc(100vh - 250px)", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {observations.map((obs) => (
          <Marker key={obs.id} position={[obs.latitude, obs.longitude]}>
            <Popup>
              <h3>{obs.title}</h3>
              <p>{obs.description}</p>
              <p>Data: {new Date(obs.timestamp).toLocaleString()}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

// Komponent statystyk
function Statistics() {
  const { observations } = useContext(ObservationContext);
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["UFO", "Zjawisko astronomiczne", "Niezidentyfikowany obiekt"],
        datasets: [
          {
            label: "Liczba obserwacji",
            data: [
              observations.filter((obs) => obs.type === "UFO").length,
              observations.filter(
                (obs) => obs.type === "Zjawisko astronomiczne"
              ).length,
              observations.filter(
                (obs) => obs.type === "Niezidentyfikowany obiekt"
              ).length,
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: "white",
            },
          },
          x: {
            ticks: {
              color: "white",
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "white",
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [observations]);

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">
        Statystyki Obserwacji
      </h2>
      <div className="bg-gray-800 p-8 rounded-lg">
        <canvas ref={canvasRef}></canvas>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-purple-400 mb-2">
            Całkowita liczba obserwacji
          </h3>
          <p className="text-2xl text-white">{observations.length}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-purple-400 mb-2">
            Najpopularniejszy typ
          </h3>
          <p className="text-2xl text-white">
            {Object.entries(
              observations.reduce((acc, obs) => {
                acc[obs.type] = (acc[obs.type] || 0) + 1;
                return acc;
              }, {})
            ).sort((a, b) => b[1] - a[1])[0]?.[0] || "Brak danych"}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-purple-400 mb-2">
            Ostatnia obserwacja
          </h3>
          <p className="text-2xl text-white">
            {observations.length > 0
              ? new Date(
                  Math.max(
                    ...observations.map((obs) => new Date(obs.timestamp))
                  )
                ).toLocaleDateString()
              : "Brak danych"}
          </p>
        </div>
      </div>
    </div>
  );
}

// Komponent formularza logowania
function LoginForm({ loginUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginUser(username, password)) {
      navigate("/");
    } else {
      setError("Nieprawidłowa nazwa użytkownika lub hasło");
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4 max-w-md">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">Zaloguj się</h2>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-400"
          >
            Nazwa użytkownika
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-400"
          >
            Hasło
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300"
        >
          Zaloguj
        </button>
      </form>
      <p className="mt-4 text-center text-gray-400">
        Nie masz konta?{" "}
        <Link to="/register" className="text-purple-400 hover:underline">
          Zarejestruj się
        </Link>
      </p>
    </div>
  );
}

// Komponent formularza rejestracji
function RegisterForm({ registerUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Hasła nie pasują do siebie");
      return;
    }
    registerUser(username, password);
    navigate("/");
  };

  return (
    <div className="container mx-auto mt-8 p-4 max-w-md">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">
        Zarejestruj się
      </h2>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-400"
          >
            Nazwa użytkownika
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-400"
          >
            Hasło
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-400"
          >
            Potwierdź hasło
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300"
        >
          Zarejestruj
        </button>
      </form>
      <p className="mt-4 text-center text-gray-400">
        Masz już konto?{" "}
        <Link to="/login" className="text-purple-400 hover:underline">
          Zaloguj się
        </Link>
      </p>
    </div>
  );
}

// Komponent profilu użytkownika
function UserProfile({ user }) {
  const { observations } = useContext(ObservationContext);
  const userObservations = observations.filter((obs) => obs.userId === user.id);

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">
        Profil Użytkownika
      </h2>
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold text-white mb-2">
          Nazwa użytkownika: {user.username}
        </h3>
        <p className="text-gray-300">
          Liczba obserwacji: {userObservations.length}
        </p>
      </div>
      <h3 className="text-xl font-bold text-purple-400 mb-4">
        Twoje Obserwacje
      </h3>
      <ul className="space-y-4">
        {userObservations.map((obs) => (
          <li key={obs.id} className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-purple-400">
              {obs.title}
            </h4>
            <p className="text-gray-300">
              Data: {new Date(obs.timestamp).toLocaleString()}
            </p>
            <p className="text-gray-300">Lokalizacja: {obs.location}</p>
            <p className="text-gray-300">Typ: {obs.type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
