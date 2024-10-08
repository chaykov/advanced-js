import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="flex flex-col items-center">
      <header
        className="w-full text-center py-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2024/07/29/01/12/ai-generated-8928672_1280.jpg')",
        }}
      >
        <h1 className="text-5xl font-bold text-white mb-4">
          Odkryj Nieznane z SkyWitness
        </h1>
        <p className="text-xl text-gray-200 mb-8">
          Twoje okno na tajemnice kosmosu i niezidentyfikowane zjawiska
        </p>
        <Link
          to="/add-observation"
          className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg hover:bg-purple-700 transition duration-300"
        >
          Zgłoś Obserwację
        </Link>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">
              Zgłaszaj
            </h2>
            <p className="text-gray-300">
              Podziel się swoimi obserwacjami UFO i niezwykłych zjawisk
              astronomicznych z naszą globalną społecznością.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">
              Analizuj
            </h2>
            <p className="text-gray-300">
              Korzystaj z naszych narzędzi do analizy danych i odkrywaj wzorce w
              zgłoszonych obserwacjach.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">
              Odkrywaj
            </h2>
            <p className="text-gray-300">
              Eksploruj mapę obserwacji z całego świata i bądź na bieżąco z
              najnowszymi odkryciami.
            </p>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-purple-300 mb-4">
            Dołącz do Nas
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Razem możemy odkryć tajemnice, które kryje przed nami wszechświat.
          </p>
          <Link
            to="/register"
            className="bg-green-600 text-white px-8 py-3 rounded-full text-lg hover:bg-green-700 transition duration-300"
          >
            Zarejestruj się
          </Link>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
